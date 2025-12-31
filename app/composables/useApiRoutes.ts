import type { Store } from 'pinia';
export const useApiRoutes = async () => {

    const routes = useState<Record<string, RouteType>>('api-routes', () => ({}));
    const route = useRoute();
    const current = ref<string>(route.path);

    const toolbar = computed(() => {
        current.value = route.path;
        return routes.value[current.value]?.toolbar;
    });

    const store = computed(() => {
        current.value = route.path;

        const name = routes.value[current.value]?.toolbar?.store;

        const pinia = useNuxtApp().$pinia;

        const store = (pinia as any)._s.get(name) as Store<string, { 
            refresh? : (params?: { filter?: string; page?: number, search?: string }) => Promise<void> 
        }>;

        return store;
        
    });

    const { data, error } = await useFetch<Record<string, RouteType>>("/api/configuration/routes", {
        key: 'api-routes-fetch',
    });

    if (!error.value && data.value) routes.value = data.value;

    return {
        routes,
        toolbar,
        store
    };
}


