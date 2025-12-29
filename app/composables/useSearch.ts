import type { LocationQueryValue } from 'vue-router';

const search = ref<string | null>(null);
const { clear, get, LastEntry, set } = useHistory<{ search: string | null }>();

export const useSearch = (
    options?: {
    localSearch?: Ref<string | null>;
    callback?: (
        params: { 
            filter: string;
            search: string;
            page: number 
        }
    ) => Promise<void>,
}) => {

    const router = useRouter();
    const route = useRoute();

    search.value = route.query.search as string || null;
    if(options?.localSearch) options.localSearch.value = search.value;

    const execute = async (value: string) => {

        if (options?.callback) {
            await options.callback({
                filter: route.query.filter as string || 'all',
                search: value,
                page: 1
            });
        }
    }

    watch( () => route.path, async () => {

        search.value = null
        if (options?.localSearch) options.localSearch.value = null

        const lastEntry = LastEntry(route.path);
        if (lastEntry) {
            clear(route.path);
            await execute("")
        }
    });

    const setSearch = async (value: string | LocationQueryValue[] | null) => {

        if (typeof value == 'object') return;

        set(route.path, [
            ...get(route.path),
            { search: value as string || null }
        ]);

        if (!value) {
            search.value = null;
        
            const query = { ...route.query };
            delete query.search;

            router.replace({ query });
            await execute('');
        }

        else {
            search.value = value as string;
            
            router.replace({ query: { ...route.query, search: value } });
            await execute(value as string);
        }
    }

    return {
        search,
        history: {
            LastEntry: (path: string) => LastEntry(path),
            clear: (path: string) => clear(path),
        },
        setSearch,
    };

};
