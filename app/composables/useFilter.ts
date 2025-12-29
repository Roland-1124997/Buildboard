import type { LocationQueryValue } from 'vue-router';

const filter = ref<string | null>(null);
const { clear, get, LastEntry, set } = useHistory<{ filter: string | null }>();


export const useFilter = (options?: {
    callback?: (
        params: { 
            filter: string; 
            page: number 
        }
    ) => Promise<void>,
}) => {

    const router = useRouter();
    const route = useRoute();

    filter.value = route.query.filter as string || "all";

    const execute = async (value: string) => {

        if (options?.callback) {
            await options.callback({
                filter: value,
                page: 1
            });
        }
    }

    watch( () => route.path, async () => {
        filter.value = "all"

        const lastEntry = LastEntry(route.path);

        if (lastEntry) {
            clear(route.path);
            await execute("all")
        }
    });

    const setFilter = async (value: string | LocationQueryValue[] | null) => {

        set(route.path, [
            ...get(route.path),
            { filter: value as string || null }
        ]);

        if (!value) {
            filter.value = null;

            const query = { ...route.query };
            delete query.filter;
            delete query.page;

            router.replace({ query });
        }

        else {
            filter.value = value as string;
            router.replace({ query: { ...route.query, filter: value, page: 1 } });
        
            await execute(value as string);
        }
    }

    return {
        filter,
        history: {
            LastEntry: (path: string) => LastEntry(path),
            clear: (path: string) => clear(path),
        },
        setFilter,
    };
};

