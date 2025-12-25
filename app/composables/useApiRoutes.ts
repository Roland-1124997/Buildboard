export const useApiRoutes = async () => {

    const routes = useState<Record<string, RouteType>>('api-routes', () => ({}));
    const route = useRoute();
    const current = ref<string>(route.path);

    const toolbar = computed(() => {
        current.value = route.path;
        return routes.value[current.value]?.toolbar;
    });

    const { data, error } = await useFetch<Record<string, RouteType>>("/api/configuration/routes", {
        key: 'api-routes-fetch',
    });

    if (!error.value && data.value) routes.value = data.value;

    return {
        routes,
        toolbar,
    };
}

