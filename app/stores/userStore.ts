export const useSessions = defineStore("session", () => {

    const session: any = ref({
        data: null,
        error: true,
    });

    const setSession = (data: any, error: any) => session.value = { data, error };

    const clearSession = () => {
        session.value = { data: null, error: null };
    };

    const getSession = async () => session.value;

    return {
        setSession,
        getSession,
        clearSession,
    };
});