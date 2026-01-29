export const useArticles = defineStore("useArticles", () => {

    const { addToast } = useToast();
    const { create, close } = useModal();
    const { wait } = useDebounce();

    const isPreloading = ref<boolean>(false);

    const uri = "/api/articles";
    const Request = useApiHandler<ApiResponse<FileData[]>>(uri);

    const articles = ref<any[] | any>(null);
    const error = ref<any[] | any>(null);

    const storedPayload = useLocalStorage<string | null>("articles:payload", null);
    const savePayload = async (payload: any) => storedPayload.value = JSON.stringify(payload);
    const clearSavedPayload = () => storedPayload.value = null;

    const getSavedPayload = () => {
        if (storedPayload.value) return JSON.parse(storedPayload.value);
        return null;
    };

    const refresh = async (params?: {
        filter?: string; page?: number, search?: string
    }) => {

        const { data, error: Error } = await Request.Get({
            query: {
                page: params?.page || useRoute().query.page || 1,
                filter: params?.filter || useRoute().query.filter || 'all',
                search: params?.search !== undefined ? params.search : (useRoute().query.search || '')
            },
        });

        if (!Error && data) {
            articles.value = data.data;
        }

        else {
            error.value = Error;
            addToast({
                message: "Er is een fout opgetreden bij het vernieuwen van de artikelen.",
                type: "error",
            });
        }

    }

    const initialPayload = async () => {

        const { data, error: Error } = await useFetch<ApiResponse<any>>(uri);

        if (!Error.value && data.value) {
            articles.value = data.value.data;
        }

        else {
            error.value = Error.value;
            addToast({
                message: "Er is een fout opgetreden bij het ophalen van artikelen.",
                type: "error",
            });
        }
    };

    const preload = async () => {

        if (!articles.value || isPreloading.value) return;

        const promises = articles.value
            .filter((article: any) => article.thumbnail_url)
            .map((article: any) => fetch(article.thumbnail_url));

        isPreloading.value = true;
        
        await Promise.all(promises);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        
        isPreloading.value = false;
    }

    const filter = (query: string) => {
        if (!query) return articles.value;

        return articles.value?.filter((article: any) => {

            const title = article.title || "";
            const description = article.description || "";
            const topics = article.topics.map((t: any) => t).join(" ") || "";

            const foundInTitle = title.toLowerCase().includes(query.toLowerCase());
            const foundInDescription = description.toLowerCase().includes(query.toLowerCase());
            const foundInTopics = topics.toLowerCase().includes(query.toLowerCase());

            return foundInTitle || foundInDescription || foundInTopics;
        });

    };

    const remove = (id: number) => {

        const content = articles.value.find((art: any) => art.id === id);

        const onComplete = async () => {
            close();
            await refresh();
        }

        const onCancel = () => close();

        create({
            name: `Verwijder artikel ${content.title}`,
            description: "Weet je zeker dat je dit artikel wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.",
            component: "Confirm",
            props: {
                onCancel,
                onComplete,
                request: {
                    url: `/api/articles/${id}`,
                    method: "DELETE",
                    secure: false,
                },
                message: {
                    success: `Artikel ${content.title} succesvol verwijderd.`,
                    confirm: "Ja, verwijder het artikel",
                    cancel: "Nee, behoud het artikel",
                }
            },
        });
    };

    return {
        articles,
        error,
        initialPayload,
        filter,
        remove,
        refresh,
        savePayload,
        getSavedPayload,
        clearSavedPayload,
        preload
    };

});

