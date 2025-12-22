export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event);
    const currentSession = await useGetCookies(event);

    const { data, error } = await useGetSession(client, currentSession);

    if (error) {
        const { data, error } = await useRefreshSession(client, currentSession);
        if (!data.session || error) return useReturnResponse(event, unauthorizedError);

        useSetCookies(event, data.session);

        if (data.user?.factors) setCookie(event, "opt-verified", "true", {
            maxAge: 60 * 60 * 24 * 14,
            httpOnly: true,
        })

        return useReturnResponse(event, {
            status: {
                success: true,
                message: "Ok",
                code: 200
            },
            data: await useSetSessionData(event, data.user)
        });
    }

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Gberuiker succesvol opgehaald",
            code: 200
        },
        data: await useSetSessionData(event, data.user)
    });
});