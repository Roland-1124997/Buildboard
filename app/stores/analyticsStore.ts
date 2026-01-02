export const useAnalytics = defineStore("useAnalytics", () => {

    const { addToast } = useToast();

    const analytics = ref<any | null>(null);
    const statistics = computed(() => analytics.value?.statistics || null);
    const metrics = computed(() => analytics.value?.metrics || null);
    const error = ref<any | null>(null);

    const uri = "/api/umami/analytics";
    const Request = useApiHandler<ApiResponse<any>>(uri);

    const refresh = async (params?: { filter?: string, page?: number }) => {

        const { data, error: Error } = await Request.Get({
            query: { filter: params?.filter || useRoute().query.filter || 'vandaag' },
        });

        if (!Error && data) analytics.value = data.data;

        else {
            error.value = Error;
            addToast({
                message: "Er is een fout opgetreden bij het vernieuwen van de analytics gegevens.",
                type: "error",
            });
        }
    }

    const initialPayload = async () => {

        const { data, error: Error } = await useFetch<ApiResponse<any>>(uri);

        if (!Error.value && data.value) {
            analytics.value = data.value.data;
        }

        else {
            error.value = Error.value;
            addToast({
                message: "Er is een fout opgetreden bij het ophalen van de analytics gegevens.",
                type: "error",
            });
        }
    };

    return {
        analytics,
        statistics,
        metrics,
        error,
        initialPayload,
        refresh,
    };

});

