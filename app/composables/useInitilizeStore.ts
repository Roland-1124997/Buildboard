

export const useInitilizeStore = async (toolbar: ToolBar, params: { filter?: string; page?: number }) => {
    
    const storeName = toolbar?.store;

    if (storeName) {
        const pinia = useNuxtApp().$pinia;
        const currentStore = (pinia as any)._s.get(storeName) as StoreType;
        if (currentStore && currentStore.refresh) await currentStore.refresh(params);
    }
};