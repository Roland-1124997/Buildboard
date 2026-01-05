
export const useMakePagination = (itemsPerPage: number = 16, page: number = 1) => {

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    return { items: itemsPerPage, start, end }

}

export const types: FileType[] = [
    { extension: "png", label: "Afbeelding", color: "text-blue-800", background: "bg-blue-50" },
    { extension: "jpg", label: "Afbeelding", color: "text-blue-800", background: "bg-blue-50" },
    { extension: "jpeg", label: "Afbeelding", color: "text-blue-800", background: "bg-blue-50" },
    { extension: "gif", label: "Afbeelding", color: "text-blue-800", background: "bg-blue-50" },
    { extension: "webp", label: "Afbeelding", color: "text-blue-800", background: "bg-blue-50" },
    { extension: "pdf", label: "PDF Document", color: "text-red-800", background: "bg-red-50" },
    { extension: "doc", label: "Word Document", color: "text-indigo-800", background: "bg-blue-50" },
    { extension: "docx", label: "Word Document", color: "text-indigo-800", background: "bg-blue-50" },
    { extension: "xls", label: "Excel Sheet", color: "text-green-800", background: "bg-green-50" },
    { extension: "xlsx", label: "Excel Sheet", color: "text-green-800", background: "bg-green-50" },
    { extension: "ppt", label: "PowerPoint", color: "text-orange-800", background: "bg-orange-50" },
    { extension: "pptx", label: "PowerPoint", color: "text-orange-800", background: "bg-orange-50" },
    { extension: "txt", label: "Tekstbestand", color: "text-gray-800", background: "bg-gray-50" },
    { extension: "zip", label: "ZIP Archief", color: "text-purple-800", background: "bg-purple-50" },
];

const getProperty = (types: FileType[], extension: string, property: "label" | "color" | 'background'): string => {
    const type = types.find((type) => type.extension === extension.toLowerCase());
    return type ? type[property] : "";
}

export const getIconColor = (types: FileType[], extension: string): string => getProperty(types, extension, "color");
export const getIconBackground = (types: FileType[], extension: string): string => getProperty(types, extension, "background");
export const getTypeLabel = (types: FileType[], extension: string): string => getProperty(types, extension, "label");

export const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];
    const base = 1024;

    const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));
    const size = bytes / Math.pow(base, unitIndex);

    return `${size.toFixed(2)} ${units[unitIndex]}`;
};