import type { LocationQueryValue } from 'vue-router';

const filter = ref<string | null>(null);
const { clear, get, LastEntry, set } = useHistory();

export const useFilter = (options?: {
    enableWatch?: boolean;
    fallbackFilter?: Ref<string | null>;
    callback?: (
        params: { 
            filter: string; 
            page: number 
        }
    ) => Promise<void>,
}) => {

    const loading = ref(false);
    const activeType = computed(() => filter.value);

    const router = useRouter();
    const route = useRoute();

    filter.value = route.query.filter as string || options?.fallbackFilter?.value || null;

    const execute = async (value: string) => {

        if (options?.callback) {

            loading.value = true;

            await options.callback({
                filter: value,
                page: 1
            });

            loading.value = false;
        }
    }

    if (options?.enableWatch) {

        watch(() => route.path, async () => {

            const lastEntry = LastEntry(route.path);
            filter.value = lastEntry?.filter || options?.fallbackFilter?.value || null;

            if (options?.fallbackFilter?.value != filter.value) {
                router.replace({
                    query: {
                        ...route.query,
                        filter: filter.value || undefined,
                    }
                });
            }
        });
    }

    const setFilter = async (value: string | LocationQueryValue[] | null, page?: number | null) => {

        const query = { ...route.query };
        const lastEntry = LastEntry(route.path);
        delete query.page;

        set(route.path, [
            { 
                filter: value as string || "",
                search: route.query.search as string || "",
                page: route.query.page ? parseInt(route.query.page as string) : null,
            }
        ]);

        filter.value = value as string;
        query.filter = filter.value;

        router.replace({ query });
        if(value === lastEntry?.filter) return

        await execute(value as string);
        
    }

    return {
        filter,
        history: {
            LastEntry: (path: string) => LastEntry(path),
            clear: (path: string) => clear(path),
        },
        setFilter,
        loading,
        activeType,
    };
};

