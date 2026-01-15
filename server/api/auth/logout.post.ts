export default defineSupabaseEventHandler(async (event, { user, server}) => {

    const { error } = await useDeleteSession(server, user);

    if (error) return useReturnResponse(event, internalServerError);

    await useDeleteCookies(event);
    return useReturnResponse(event, {
        status: {
            success: true,
            message: "je bent uitgelogd",
            redirect: "/auth/login",
            code: 200
        }
    });

});