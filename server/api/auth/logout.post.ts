export default defineSupabaseEventHandler(async (event, { server }) => {

    const { error } = await server.auth.signOut();

    if (error) return useReturnResponse(event, internalServerError);

    await useDeleteCookies(event);
    await useStorage(`sessions`).removeItem("session");
    
    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Logged out successfully",
            redirect: "/auth/login",
            code: 200
        }
    });

});