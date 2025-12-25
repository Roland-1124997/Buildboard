export const useBadge = () => {

    const setBadge = async (count: number) => {
        if(import.meta.server) return;

        try {
            if (count > 0) await (navigator as any).setAppBadge(count);
            else await (navigator as any).clearAppBadge();

        } catch (error) {
            console.error('Failed to set app badge:', error);
        }
    };

    const clearBadge = async () => {
        if (import.meta.server) return;

        try {
            await (navigator as any).clearAppBadge();

        } catch (error) {
            console.error('Failed to clear app badge:', error);
        }
    };

    return {
        setBadge,
        clearBadge
    };
};
