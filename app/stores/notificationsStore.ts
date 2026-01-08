export const useNotifications = defineStore("useNotifications", () => {

    const { create, close } = useModal();
    const { addToast } = useToast();
    const { setBadge } = useBadge();

    const uri = "/api/notifications";
    const Request = useApiHandler<ApiResponse<any>>(uri);

    const pagination = ref<{
        page: number;
        total: number;
    }>({
        page: 1,
        total: 1,
    });

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

    const refresh = async (params?: {
        filter?: string; page?: number, search?: string
    }) => {

        const { data, error: Error } = await Request.Get({
            query: { 
                page: params?.page || useRoute().query.page || 1,
                filter: params?.filter || useRoute().query.filter || 'all',
                search: params?.search !== undefined ? params.search : (useRoute().query.search || '')
            },
        });

        if (!Error && data) {
            pagination.value.page = data.pagination?.page || 1;
            pagination.value.total = data.pagination?.total || 1;

            messages.value = data.data?.messages || [];
            unseen.value = data.data?.unseen || 0;

            await setBadge(unseen.value);
        }

        else {
            error.value = Error;
            addToast({
                message: "Er is een fout opgetreden bij het verversen van de berichten.",
                type: "error",
            });
        }

    }

    const initialPayload = async () => {

        const { data, error: Error } = await useFetch<ApiResponse<any>>('/api/notifications', {
            query: { 
                page: useRoute().query.page || 1,
                filter: useRoute().query.filter || 'all',
                search: useRoute().query.search || ''
            },
        });

        if (!Error.value && data.value) {

            pagination.value.page = data.value?.pagination?.page || 1;
            pagination.value.total = data.value?.pagination?.total || 1;

            messages.value = data.value?.data.messages || [];
            unseen.value = data.value?.data.unseen || 0;
            await setBadge(unseen.value);
        }

        else {
            error.value = Error.value;
            // addToast({
            //     message: "Er is een fout opgetreden bij het ophalen van berichten.",
            //     type: "error",
            // });
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
            message: `Fout bij het markeren van de notificatie als gelezen:`,
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
            message: `Fout bij het markeren van de notificatie als ongelezen:`,
        });

        await refresh()
    };


    const requestPermission = async () => {

        if (!("Notification" in window) || Notification.permission !== "default") return;

        Notification.requestPermission()
            .then((permission) => {

                if (permission !== 'granted') {
                    addToast({
                        message: `notificatie permissies geweigerd!`,
                        type: "error",
                        duration: 5000,
                    })
                    return
                }

                addToast({
                    message: `Notificatie permissies verleend!`,
                    type: "success",
                    duration: 5000,
                })

                return navigator.serviceWorker.ready
            })

            .catch((error) => addToast({
                message: `Fout bij het aanvragen van notificatie permissies: ${error}`,
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

            if (error) return addToast({
                type: "error",
                message: `Fout bij het verwijderen van het bericht`,
            });

            addToast({
                type: "success",
                message: "Bericht succesvol verwijderd",
            });

            await refresh({ page: 1 });

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
            path: "/berichten/opstellen",
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

        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            create({
                hideOnDesktop: true,
                name: message.subject || "Geen onderwerp",
                description: "",
                component: "Email",
                props: {
                    message,
                    onConfirm: (payload: Record<string, any>) => {
                        compose(payload)
                        backToList();
                        close();
                    },
                }
            });
        }

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

    const openMessageById = async (id: string) => {

        const messageToOpen = messages.value.find((msg: any) => {
            return msg.id === id;
        });

        if (messageToOpen) await selectMessage(messageToOpen);
    };

    const nextPage = async () => {
        if (pagination.value.page < pagination.value.total) {

            const router = useRouter();
            pagination.value.page += 1;

            await refresh({
                page: pagination.value.page
            });

            router.replace({
                query: {
                    ...useRoute().query,
                    page: pagination.value.page,
                },
            });

            
        }
    };

    const previousPage = async () => {
        if (pagination.value.page > 1) {
            pagination.value.page -= 1;

            const router = useRouter();

            await refresh({
                page: pagination.value.page
            });

            router.replace({    
                query: {
                    ...useRoute().query,
                    page: pagination.value.page,
                },
            });

        }
    };

    const toPage = async (page: number) => {
        if (page >= 1 && page <= pagination.value.total) {
            pagination.value.page = page;

            const router = useRouter();

            await refresh({
                page: pagination.value.page
            });

            router.replace({
                query: {
                    ...useRoute().query,
                    page: pagination.value.page,
                },
            });

        }

    };

    return {
        messages,
        selected,
        unseen,
        error,
        activeMessageId,
        pagination,
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
        nextPage,
        previousPage,
        toPage,
    };
});

