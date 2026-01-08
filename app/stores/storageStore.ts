const fetchBlob = async (url: string): Promise<{ data: Blob | null; error: any }> =>
    await useApiHandler(url).Get<Blob>({ responseType: "blob" });

const createBlobLink = (blob: Blob, filename: string, mimetype?: string) => {
    const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: mimetype }));
    const link = document.createElement("a");

    link.href = blobUrl;
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(blobUrl);
};



export const useStorage = defineStore("useStorage", () => {

    const { create, close } = useModal();
    const { addToast } = useToast();

    const uri = "/api/storage";
    const Request = useApiHandler<ApiResponse<Record<string, FileData[]>>>(uri);

    const count = ref<Number>();
    const files = ref<Record<string, FileData[]>>({});
    const error = ref<ErrorResponse | null | any>(null);

    const refresh = async (params?: {
        filter?: string; page?: number, search?: string
    }) => {

        const { data, error: Error } = await Request.Get({
            query: {
                page: params?.page || useRoute().query.page || 1,
                filter: params?.filter || useRoute().query.filter || 'alles',
                search: params?.search !== undefined ? params.search : (useRoute().query.search || '')
            },
        });

        if (!Error && data) {
            files.value = data.data ?? {};
            count.value = Object.values(data.data ?? {}).flat().length;
        }

        else {
            error.value = Error;
            addToast({
                message: "Er is een fout opgetreden bij het verversen van de bestanden.",
                type: "error",
            });
        }
    };

    const initialPayload = async () => {

        const { data, error: Error } = await useFetch<ApiResponse<Record<string, FileData[]>>>(uri, {
            query: {
                page: useRoute().query.page || 1,
                filter: useRoute().query.filter || 'alles',
                search: useRoute().query.search || ''
            },
        });

        if (!Error.value && data.value) {
            files.value = data.value?.data || {};
            count.value = Object.values(data.value?.data || {}).flat().length;
        }

        else {
            error.value = Error.value;
            // addToast({
            //     message: "Er is een fout opgetreden bij het ophalen van bestanden.",
            //     type: "error",
            // });
        }
    };

    const upload = async (fileList: FileList) => {

        const formData = new FormData();

        addToast({
            message: "Je bestanden worden geüpload.",
            type: "info",
        });

        const filesArray = Array.from(fileList);
        filesArray.forEach((file) => {
            formData.append(file.name.replaceAll(" ", "-"), file);
        });

        const { error } = await Request.Post({ body: formData });

        if (error) return addToast({
            message: "Er is een fout opgetreden tijdens het uploaden van je bestanden.",
            type: "error",
        });

        addToast({
            message: "Je bestanden zijn succesvol geüpload.",
            type: "success",
        });

        await refresh();
    };

    const patch = async (file: FileData) => {

        const { error } = await Request.Patch({
            extends: `/${file.id}`,
            body: { published: !file.published },
        });

        if (error) return addToast({
            message: "Er is een fout opgetreden tijdens het bijwerken van het bestand.",
            type: "error",
            duration: 5000,
        });

        addToast({
            message: `Bestand ${!file.published ? "succesvol zichtbaar gemaakt" : "succesvol verborgen"}.`,
            type: "info",
        });

        await refresh();
    };

    const remove = async (file: FileData) => {

        const onConfirm = async () => {

            const { error } = await Request.Delete({ extends: `/${file.id}` });

            close();

            if (error) return addToast({
                message: "Er is een fout opgetreden tijdens het verwijderen van het bestand.",
                type: "error",
                duration: 5000,
            });

            addToast({
                message: "Bestand succesvol verwijderd.",
                type: "success",
            });

            await refresh();
        };

        const onCancel = () => {

            close();
            addToast({
                message: "Bestand verwijderen geannuleerd.",
                type: "info",
            });
        };

        create({
            name: "Confirmatie-Modal",
            description: "Weet je zeker dat je dit bestand wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
            component: "Confirm",
            props: { onConfirm, onCancel, message: file, type: "bestand" },
        });
    };

    const preview = async (file: FileData) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.platform);


        if (isMobile) return await download(file, { mimetype: file.metadata.mimetype });

        navigateTo(file.media, {
            open: {
                target: "_blank",
            },
        });
    };

    const download = async (file: FileData, options?: { mimetype?: string }) => {
        const { data, error } = await fetchBlob(file.media);

        if (error || !data) return addToast({
            message: "Failed to download file.",
            type: "error",
            duration: 5000,
        });

        createBlobLink(data, file.name, options?.mimetype);
    };

    return {
        count,
        files,
        error,
        refresh,
        initialPayload,
        upload,
        patch,
        remove,
        download,
        preview,
    };
});

