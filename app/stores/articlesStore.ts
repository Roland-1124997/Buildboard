export const useArticles = defineStore("articles", () => {

    const { addToast } = useToast();
    const { create, close } = useModal();

    const uri = "/api/articles";
    const Request = useApiHandler<ApiResponse<FileData[]>>(uri);

    const articles = ref<any[] | any>(null);
    const error = ref<any[] | any>(null);

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

        const onConfirm = async () => {
            const { error } = await Request.Delete({ extends: `/${id}` });

            close();

            if (error)
                return addToast({
                    message: "Er is een fout opgetreden bij het verwijderen van het artikel",
                    type: "error",
                });

            articles.value = articles.value?.filter((art: any) => art.id !== id);

            addToast({
                message: "Artikel succesvol verwijderd",
                type: "success",
            });
        };

        const onCancel = () => {
            close();
            addToast({
                message: "Verwijderen geannuleerd",
                type: "info",
            });
        };

        create({
            name: "Confirmatie-Modal",
            description: "Weet je zeker dat je dit artikel wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.",
            component: "Confirm",
            props: { onConfirm, onCancel, message: content, type: "artikel" },
        });
    };

    return {
        articles,
        error,
        initialPayload,
        filter,
        remove,
    };

});

