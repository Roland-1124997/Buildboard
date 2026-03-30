import type { LocationQueryValue } from "vue-router";

const search = ref<string | null>(null);
const { clear, get, LastEntry, set } = useHistory();

export const useSearch = (options?: { localSearch?: Ref<string | null>; callback?: (params: { filter: string; search: string; page: number }) => Promise<void> }) => {
	const router = useRouter();
	const route = useRoute();

	search.value = (route.query.search as string) || null;
	if (options?.localSearch) options.localSearch.value = search.value;

	const execute = async (value: string) => {
		if (options?.callback) {
			await new Promise((resolve) => setTimeout(resolve, 300));

			await options.callback({
				filter: (route.query.filter as string) || "",
				search: value || "",
				page: 1,
			});
		}
	};

	const setSearch = async (value: string | LocationQueryValue[] | null, pathOverride?: string) => {
		const path = pathOverride || route.path;
		const current = (value as string | null) || null;
		const lastEntry = LastEntry(path);

		if ((lastEntry?.search || "") === (current || "")) return;

		set(path, [
			{
				search: current || "",
				filter: (lastEntry?.filter as string) || (route.path === path ? (route.query.filter as string) || "" : ""),
				page: 1,
			},
		]);

		if (route.path !== path) return;

		search.value = current;

		const query = { ...route.query } as { [key: string]: string | number | undefined };
		delete query.page;

		if (current) query.search = current;
		else delete query.search;

		const routeSearch = (route.query.search as string) || null;
		const routePage = (route.query.page as string) || null;
		const nextSearch = (query.search as string) || null;

		const nextPage = query.page !== undefined ? String(query.page) : null;
		const hasRouteChange = routeSearch !== nextSearch || routePage !== nextPage;

		if (hasRouteChange) await router.replace({ query }).catch(() => {});
		await execute(current || "");
	};

	return {
		search,
		history: {
			LastEntry: (path: string) => LastEntry(path),
			clear: (path: string) => clear(path),
			get: (path: string) => get(path),
			set: (path: string, entries: any[]) => set(path, entries),
		},
		setSearch,
	};
};
