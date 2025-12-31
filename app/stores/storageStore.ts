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

const getProperty = (types: FileType[], extension: string, property: "label" | "color" | "background"): string => {
    const type = types.find((type) => type.extension === extension.toLowerCase());
    return type ? type[property] : property === "label" ? "Onbekend bestandstype" : property === "color" ? "text-gray-600" : "bg-gray-50";
};

export const useStorage = defineStore("useStorage", () => {

    const { create, close } = useModal();
    const { addToast } = useToast();

    const uri = "/api/storage";
    const Request = useApiHandler<ApiResponse<FileData[]>>(uri);

    const files = ref<FileData[]>([]);
    const error = ref<ErrorResponse | null | any>(null);

    const getIconColor = (types: FileType[], extension: string): string => getProperty(types, extension, "color");
    const getIconBackground = (types: FileType[], extension: string): string => getProperty(types, extension, "background");
    const getTypeLabel = (types: FileType[], extension: string): string => getProperty(types, extension, "label");

    const refresh = async () => {

        const { data, error: Error } = await Request.Get();

        if (!Error && data) files.value = data.data ?? [];

        else {
            error.value = Error;
            addToast({
                message: "Er is een fout opgetreden bij het verversen van de bestanden.",
                type: "error",
            });
        }
    };

    const initialPayload = async () => {

        const { data, error: Error } = await useFetch<ApiResponse<FileData[]>>(uri);

        if (!Error.value && data.value) files.value = data.value?.data || [];

        else {
            error.value = Error.value;
            addToast({
                message: "Er is een fout opgetreden bij het ophalen van bestanden.",
                type: "error",
            });
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

    const download = async (file: FileData, options?: { mimetype?: string }) => {
        const { data, error } = await fetchBlob(file.media.preview);

        if (error || !data) return addToast({
            message: "Failed to download file.",
            type: "error",
            duration: 5000,
        });

        createBlobLink(data, file.name, options?.mimetype);
    };

    const preview = async (file: FileData) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.platform);


        if (isMobile) return await download(file, { mimetype: file.metadata.mimetype });

        navigateTo(file.media.preview, {
            open: {
                target: "_blank",
            },
        });
    };

    const formatSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";

        const units = ["Bytes", "KB", "MB", "GB"];
        const base = 1024;

        const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));
        const size = bytes / Math.pow(base, unitIndex);

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    };

    const filter = (query: string, types: FileType[],): FileData[] => {
        if (!query) return files.value;

        return files.value.filter((file: FileData) => {
            const nameLower = file.name.toLowerCase().split(".")[0] || "";
            const queryLower = query.toLowerCase();
            const labelLower = getTypeLabel(types, file.metadata.extension).toLowerCase();

            return nameLower.includes(queryLower) || labelLower.startsWith(queryLower);
        });
    };

    return {
        files,
        error,
        refresh,
        initialPayload,
        upload,
        patch,
        remove,
        download,
        preview,
        formatSize,
        getIconColor,
        getIconBackground,
        getTypeLabel,
        filter,
    };
});

