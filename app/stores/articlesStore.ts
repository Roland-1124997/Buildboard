export const useArticles = defineStore("useArticles", () => {

    const { addToast } = useToast();
    const { create, close } = useModal();
    
    const uri = "/api/articles";
    const Request = useApiHandler<ApiResponse<FileData[]>>(uri);

    const articles = ref<any[] | any>(null);
    const error = ref<any[] | any>(null);
    const loading = ref<boolean>(false);

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

        loading.value = true;
        await new Promise(resolve => setTimeout(resolve, 300));

        

        const { data, error: Error } = await Request.Get({
            query: {
                page: params?.page || useRoute().query.page || 1,
                filter: params?.filter || useRoute().query.filter || 'all',
                search: params?.search !== undefined ? params.search : (useRoute().query.search || '')
            },
        });

        if (!Error && data) {
            loading.value = false;
            articles.value = data.data;
        }

        else {
            loading.value = false;
            error.value = Error;
            addToast({
                message: "Er is een fout opgetreden bij het vernieuwen van de artikelen.",
                type: "error",
            });
        }

    }

    const initialPayload = async () => {

        loading.value = true;

        const { data, error: Error } = await useFetch<ApiResponse<any>>(uri);

        if (!Error.value && data.value) {
            loading.value = false;
            articles.value = data.value.data;
        }

        else {
            loading.value = false;
            error.value = Error.value;
            addToast({
                message: "Er is een fout opgetreden bij het ophalen van artikelen.",
                type: "error",
            });
        }
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

    const togglePublish = async (article: any) => {

        const id = article.id;
        const title = article.title;
        const publish = !article.published;

        const { data, error: Error } = await Request.Patch({
            extends: `/${id}`, query: { publish: publish }
        })

        if (!Error && data) {
            addToast({
                message: `Artikel ${title} succesvol ${publish ? "gepubliceerd" : "gedepubliceerd"}.`,
                type: "success",
            });
            await refresh();
        }
        else {
            addToast({
                message: `Er is een fout opgetreden bij het ${publish ? "publiceren" : "depubliceren"} van het artikel ${title}.`,
                type: "error",
            });
        }
    };

    return {
        articles,
        error,
        loading,
        initialPayload,
        remove,
        refresh,
        savePayload,
        getSavedPayload,
        clearSavedPayload,
        togglePublish,
    };


});

