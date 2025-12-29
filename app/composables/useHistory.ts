
type HistoryEntry<T> = { [K in keyof T]: T[K] | null };
type History<T> = Record<string, HistoryEntry<T[]>>;

export const useHistory = <T>() => {

    const history: History<T> = {}

    const clearHistory = (path: string) => {
        history[path] = [];
    }

    const getHistory = (path: string): HistoryEntry<T[]> => {
        return history[path] || [];
    }

    const getHistoryLastEntry = (path: string): T | null => {
        const entries = getHistory(path);
        if (entries.length == 0) return null;
        return entries[entries.length - 1] || null;
    }

    const setHistory = (path: string, entries: HistoryEntry<T[]>) => {
        history[path] = entries;
    }

    return {
        clear: clearHistory,
        get: getHistory,
        LastEntry: getHistoryLastEntry,
        set: setHistory,
    };

}
