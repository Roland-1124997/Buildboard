

export const useInitilizeStore = async (params: { filter?: string; page?: number }) => {
    
    const { toolbar } = await useApiRoutes();
    const storeName = toolbar.value?.store;

    if (storeName) {
        const pinia = useNuxtApp().$pinia;
        const currentStore = (pinia as any)._s.get(storeName) as StoreType;
        if (currentStore && currentStore.refresh) await currentStore.refresh(params);
    }
};