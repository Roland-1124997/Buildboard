const history: RouteHistory = {};

export const useHistory = () => {
	const clearHistory = (path: string) => {
		history[path] = [];
	};

	const getHistory = (path: string): HistoryEntry[] => history[path] || [];
	const getHistoryLastEntry = (path: string): HistoryEntry | null => getHistory(path)[0] || null;
	const setHistory = (path: string, entries: HistoryEntry[]) => (history[path] = entries);

	return {
		clear: clearHistory,
		get: getHistory,
		LastEntry: getHistoryLastEntry,
		set: setHistory,
	};
};
