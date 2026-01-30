export const useAnalytics = defineStore("useAnalytics", () => {

    const { addToast } = useToast();

    const analytics = ref<any | null>(null);
    const statistics = computed(() => analytics.value?.statistics || null);
    const metrics = computed(() => analytics.value?.metrics || null);
    const error = ref<any | null>(null);
    const loading = ref<boolean>(false);

    const uri = "/api/umami/analytics";
    const Request = useApiHandler<ApiResponse<any>>(uri);

    const refresh = async (params?: { filter?: string, page?: number }) => {

        loading.value = true;
        await new Promise(resolve => setTimeout(resolve, 300));

        const { data, error: Error } = await Request.Get({
            query: { filter: params?.filter || useRoute().query.filter || 'vandaag' },
        });

        if (!Error && data) {
            loading.value = false;
            analytics.value = data.data;
        }

        else {
            loading.value = false;
            error.value = Error;

            addToast({
                message: "Er is een fout opgetreden bij het vernieuwen van de analytics gegevens.",
                type: "error",
            });
        }
    }

    const initialPayload = async () => {

        loading.value = true;

        const route = useRoute();
        const activePage = route.path === '/'

        const params = {
            filter: activePage ? (route.query.filter || 'vandaag') : 'vandaag',
        }

        const { data, error: Error } = await useFetch<ApiResponse<any>>(uri, {
            query: { ...params },
        });

        if (!Error.value && data.value) {
            loading.value = false;
            analytics.value = data.value.data;
        }

        else {
            loading.value = false;
            error.value = Error.value;

            addToast({
                message: "Er is een fout opgetreden bij het ophalen van de analytics gegevens.",
                type: "error",
            });
        }
    };

    return {
        analytics,
        loading,
        statistics,
        metrics,
        error,
        initialPayload,
        refresh,
    };

});

