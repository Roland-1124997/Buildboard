
export default defineSupabaseEventHandler(async (event, { server }) => {

    const imap_client = await useConnectClient();
    await useGetImapMailbox(imap_client, 'INBOX');
    
    const id = getRouterParam(event, 'id');

    const search = { uid: id };

    const { error } = await useDeleteMessage(imap_client, search);
    if (error) return useReturnResponse(event, internalServerError);
    
    return useReturnResponse(event, {
        status: {
            success: true,
            code: 200,
            message: "Bericht succesvol verwijderd"
        }
    })
})