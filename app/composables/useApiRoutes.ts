const error = ref<any | null>(null);

export const useApiRoutes = async () => {

    const routes = useState<Record<string, RouteType>>('api-routes', () => ({}));
    const route = useRoute();
    const current = ref<string>(route.path);

    const toolbar = computed(() => {
        current.value = route.path;
        return routes.value[current.value]?.toolbar;
    });

    
    const refresh = async () => {

        const request = useApiHandler<Record<string, RouteType>>("/api/configuration/routes");

        const { data, error: Error } = await request.Get();

        if (!Error && data) routes.value = data;
        else error.value = Error;

    }

    const { data, error: Error } = await useFetch<Record<string, RouteType>>("/api/configuration/routes", {
        key: 'api-routes-fetch',
    });

    if (!Error.value && data.value) routes.value = data.value;
    else error.value = Error.value;

    return {
        error,
        routes,
        toolbar,
        refresh
    };
}


