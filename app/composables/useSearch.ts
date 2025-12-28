import type { LocationQueryValue } from 'vue-router';

const search = ref<string | null>(null);

export const useSearch = (options?: {
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

    watch(() => route.path, () => {
        search.value = null
    });

    const execute = async (value: string) => {

        if (options?.callback) {
            await options.callback({
                filter: route.query.filter as string || 'all',
                search: value,
                page: Number(route.query.page || 1)
            });
        }
    }

    const setSearch = async (value: string | LocationQueryValue[] | null) => {

        if (typeof value == 'object') return;

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
        setSearch,
    };

};

