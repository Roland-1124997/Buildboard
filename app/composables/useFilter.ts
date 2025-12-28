import type { LocationQueryValue } from 'vue-router';

const filter = ref<string | null>(null);

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

    filter.value = route.query.filter as string || null;

    const setFilter = async (value: string | LocationQueryValue[] | null) => {

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
        
            if (options?.callback) {
                await options.callback({
                    filter: value as string,
                    page: 1
                });
            }
        
        }
    }

    return {
        filter,
        setFilter,
    };
};

