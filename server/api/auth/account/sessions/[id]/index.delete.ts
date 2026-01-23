export default defineMultiFactorVerificationEventHandler(async (event, { user, client, server}) => {

    const { data, error } = await server.rpc("get_sessions_by_user", { p_user_uuid: user?.id });
    if (error) return useReturnResponse(event, internalServerError);

    const { id } = getRouterParams(event);

    const filtered = data.filter((session: any) => session.id != user?.current_session_id)
    if (filtered.length === 0) return useReturnResponse(event, unauthorizedError);

    const sessionToDelete = filtered.find((session: any) => session.id === id);
    if (!sessionToDelete) return useReturnResponse(event, unauthorizedError);
    
    await useDeleteSession(client, { ...user, current_session_id: id });

    return useReturnResponse(event, {
        status: {
            code: 200,
            message: "Session deleted successfully",
            success: true
        }
    });


});