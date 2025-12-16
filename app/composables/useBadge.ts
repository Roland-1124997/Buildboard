export const useBadge = () => {

    const isSupported = ref(false);

    onMounted(() => {
        if ('setAppBadge' in navigator && 'clearAppBadge' in navigator) {
            isSupported.value = true;
        }
    });

    const setBadge = async (count: number) => {
        if (!isSupported.value) return;

        try {
            if (count > 0) {
                await (navigator as any).setAppBadge(count);
            } else {
                await (navigator as any).clearAppBadge();
            }
        } catch (error) {
            console.error('Failed to set app badge:', error);
        }
    };

    const clearBadge = async () => {
        if (!isSupported.value) return;

        try {
            await (navigator as any).clearAppBadge();
        } catch (error) {
            console.error('Failed to clear app badge:', error);
        }
    };

    return {
        isSupported,
        setBadge,
        clearBadge
    };
};
