export const useNotifications = defineStore("Notifications", () => {

    const { create, close } = useModal();
    const { addToast } = useToast();
    const { setBadge } = useBadge();

    const uri = "/api/notifications";
    const Request = useApiHandler<ApiResponse<any>>(uri);

    const selected = ref<any | null>(null);
    const messages = ref<any[]>([]);
    const unseen = ref<number>(0);
    const error = ref<any | null>(null);

    const route = useRoute();

    const activeMessageId = computed(() => route.query.id);

    const storedPayload = useLocalStorage<string | null>("notification:payload", null);
    const savePayload = async (payload: any) => storedPayload.value = JSON.stringify(payload);
    const clearSavedPayload = () => storedPayload.value = null;

    const getSavedPayload = () => {
        if (storedPayload.value) return JSON.parse(storedPayload.value);
        return null;
    };

    watch(unseen, async (count) => await setBadge(count)), { immediate: true };

    watch(() => route.path, () => {
        selected.value = null
    });

    const refresh = async () => {

        const { data, error: Error } = await Request.Get();

        if (!Error && data) {
            messages.value = data.data?.messages || [];
            unseen.value = data.data?.unseen || 0;

            await setBadge(unseen.value);
        }

        else {
            error.value = Error;
            addToast({
                message: "Er is een fout opgetreden bij het ophalen van notificaties.",
                type: "error",
            });
        }

    }

    const initialPayload = async () => {

        const { data, error: Error } = await useFetch<ApiResponse<any>>('/api/notifications');

        if (!Error.value && data.value) {
            messages.value = data.value?.data.messages || [];
            unseen.value = data.value?.data.unseen || 0;
            await setBadge(unseen.value);
        }

        else {
            error.value = Error.value;
            addToast({
                message: "Er is een fout opgetreden bij het ophalen van notificaties.",
                type: "error",
            });
        }
    }

    const realTime = async () => {

        const event_id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const { data: events, error: Error, close } = useEventSource(`/realtime/${event_id}/notifications/`, [], {
            autoReconnect: true,
        });

        watch(events, async () => await refresh());

        if (Error.value) error.value = Error.value;

        return { close }
    };

    const markAsSeen = async (message: any) => {

        if ((message.flags).includes("\\Seen")) return

        const { error } = await Request.Patch({
            extends: `/${message.uid}`,
            query: { action: "markAsSeen" },
        })

        if (error) return addToast({
            type: "error",
            message: `Error marking notification as seen: ${error}`,
        });

        await refresh()
    };

    const markAsUnseen = async (message: any) => {

        if (!(message.flags).includes("\\Seen")) return

        const { error } = await Request.Patch({
            extends: `/${message.uid}`,
            query: { action: "markAsUnseen" },
        })

        if (error) return addToast({
            type: "error",
            message: `Error marking notification as unseen: ${error}`,
        });

        await refresh()
    };


    const requestPermission = async () => {

        if (!("Notification" in window) || Notification.permission !== "default") return;

        Notification.requestPermission()
            .then((permission) => {

                if (permission !== 'granted') {
                    addToast({
                        message: `Notification permisions denied`,
                        type: "error",
                        duration: 5000,
                    })
                    return
                }

                addToast({
                    message: `Notification permissions granted`,
                    type: "success",
                    duration: 5000,
                })

                return navigator.serviceWorker.ready
            })

            .catch((error) => addToast({
                message: `Error requesting notification permissions: ${error}`,
                type: "error",
                duration: 5000,
            }));
    };

    const deleteMessage = async (message: any) => {

        const onConfirm = async () => {

            const { error } = await Request.Delete({
                extends: `/${message.uid}`,
            });

            close();
            await refresh();

            if (error) return addToast({
                type: "error",
                message: `Error deleting notification: ${error}`,
            });

            addToast({
                type: "success",
                message: "Notification deleted successfully",
            });

            await refresh();
        };

        const onCancel = () => {

            close();
            addToast({
                type: "info",
                message: "Verwijderen geannuleerd",
            });
        };

        create({
            name: "Confirmatie-Modal",
            description: "Weet je zeker dat je dit bericht wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
            component: "Confirm",
            props: { onConfirm, onCancel, message, type: "bericht" },
        });
    };

    const compose = async (payload: Record<string, any>) => {
        await savePayload(payload);

        const router = useRouter();

        router.push({
            path: "/compose",
            query: {
                reply: "true",
            },
        });

    };

    const selectMessage = async (message: any) => {
        selected.value = message;

        const router = useRouter();

        router.replace({
            query: {
                ...useRoute().query,
                id: message.id,
            },
        });


        await markAsSeen(message);
    };

    const backToList = () => {
        selected.value = null;

        const router = useRouter();

        router.replace({
            query: {
                ...useRoute().query,
                id: undefined,
            },
        });
    };

    const filter = (query: string, filter: string) => {

        let filtered = messages.value;

        filtered = filtered.filter((message: any) => {

            const flags = message.flags || [];

            if (filter === "all") return true;
            if (filter === "gelezen") return flags.includes('\\Seen');
            else if (filter === "ongelezen") return !flags.includes('\\Seen');

        });

        if (query) {
            filtered = filtered.filter((message: any) => {
                const subject = message.subject || "";
                const from = message.from?.address || message.from?.name || "";
                const preview = message.preview || message.text || "";

                return (
                    subject.toLowerCase().includes((query as string).toLowerCase()) ||
                    from.toLowerCase().includes((query as string).toLowerCase()) ||
                    preview.toLowerCase().includes((query as string).toLowerCase())
                );
            });
        }

        return filtered;
    };

    const openMessageById = async (id: string) => {

        const messageToOpen = messages.value.find((msg: any) => {
            return msg.id === id;
        });

        if (messageToOpen) await selectMessage(messageToOpen);
    };

    return {
        messages,
        selected,
        unseen,
        error,
        activeMessageId,
        openMessageById,
        clearSavedPayload,
        savePayload,
        getSavedPayload,
        initialPayload,
        realTime,
        markAsSeen,
        markAsUnseen,
        deleteMessage,
        requestPermission,
        refresh,
        compose,
        selectMessage,
        backToList,
        filter,
    };
});

