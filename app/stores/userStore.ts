
let closeSession: Function | null = null;

export const useSessions = defineStore("useSessions", () => {

    const Request = useApiHandler<ApiResponse<any>>("/api/auth/logout");

    const { addToast } = useToast();

    const session: any = ref({
        data: null,
        error: true,
    });

    const setCloseFunction = (callback: Function) => {
        closeSession = callback;
    }

    const setSession = (data: any, error: any) => session.value = { data, error };
    const clearSession = () => session.value = { data: null, error: null };
    const getSession = async () => session.value;

    const logout = async () => {
        const { data, error } = await Request.Post();

        if (error || !data) return addToast({
            message: "Er is een fout opgetreden bij het uitloggen",
            type: "error",
        });

        const redirect = data.status.redirect;

        if (closeSession) closeSession();
        clearSession();

        addToast({
            message: "Je bent succesvol uitgelogd",
            type: "success",
        });

        return navigateTo(redirect);
    };

    return {
        setCloseFunction,
        setSession,
        getSession,
        clearSession,
        logout,
    };
});