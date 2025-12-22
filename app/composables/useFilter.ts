import type { LocationQueryValue } from 'vue-router';

const filter = ref<string | null>(null);

export const useFilter = () => {

    const router = useRouter();
    const route = useRoute();

    filter.value = route.query.filter as string || null;

    const setFilter = (value: string | LocationQueryValue[] | null) => {

        if (!value) {
            filter.value = null;

            const query = { ...route.query };
            delete query.filter;

            router.replace({ query });

        }

        else {
            filter.value = value as string;
            router.replace({ query: { ...route.query, filter: value } });
        }
    }



    return {
        filter,
        setFilter,

    };

};

