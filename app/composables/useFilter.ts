import type { LocationQueryValue } from 'vue-router';

const filter = ref<string | null>(null);
const { clear, get, LastEntry, set } = useHistory<{ filter: string | null }>();

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

    const router = useRouter();
    const route = useRoute();

    filter.value = route.query.filter as string || options?.fallbackFilter?.value || null;

    const execute = async (value: string) => {

        if (options?.callback) {
            await options.callback({
                filter: value,
                page: 1
            });
        }
    }

    if (options?.enableWatch) {

        watch(() => route.path, async () => {

            const lastEntry = LastEntry(route.path);
            filter.value = lastEntry?.filter || options?.fallbackFilter?.value || null;

        });
        
    }

    const setFilter = async (value: string | LocationQueryValue[] | null, page?: number | null) => {

        const query = { ...route.query };
        delete query.page;

        set(route.path, [
            ...get(route.path),
            { filter: value as string || null }
        ]);

        filter.value = value as string;
        query.filter = filter.value;
        
        router.replace({ query });
        await execute(value as string);
        
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

