export const useAnalytics = defineStore("analytics", () => {

    const { addToast } = useToast();

    const analytics = ref<any | null>(null);
    const statistics = computed(() => analytics.value?.statistics || null);
    const metrics = computed(() => analytics.value?.metrics || null);
    const error = ref<any | null>(null);

    const uri = "/api/umami/analytics";

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
        statistics,
        metrics,
        error,
        initialPayload,
    };

});

