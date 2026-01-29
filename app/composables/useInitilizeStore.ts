

export const useInitilizeStore = async (toolbar: ToolBar, params: { filter?: string; page?: number }) => {

    if(import.meta.server) return;
    
    const storeName = toolbar?.store;

    if (storeName) {
        const currentStore = useCurrentStore(storeName);
        if (currentStore && currentStore.refresh) await currentStore.refresh(params);
    }
};

export const useCurrentStore = (storeName: string) => {
    
    const pinia = useNuxtApp().$pinia;
    const currentStore = (pinia as any)._s.get(storeName) as StoreType;

    return currentStore;
}


export const routerStore = (name: string | undefined) => {
    if (!name) return null;
    return useCurrentStore(name);
};

export const loadStoreAlertCount = (name: string | undefined, format: boolean = false): string | number => {
    const store = routerStore(name);
    const unseen = Number(store && "unseen" in store ? (store.unseen ?? 0) : 0);

    if (format) return unseen > 99 ? "99+" : String(unseen);
    return unseen;
};

export const loadStorePreload = (name: string | undefined) => {
    const store = routerStore(name);
    if (!store) return null;

    return "preload" in store && typeof store.preload === "function" ? store.preload() : null;
};