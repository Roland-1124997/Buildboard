export default defineEventHandler(async (event) => {

    const server: SupabaseClient = await serverSupabaseClient(event);
    const { error } = await useDeleteSession(server)

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