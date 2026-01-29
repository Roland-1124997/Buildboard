
export default defineSupabaseEventHandler(async (event) => {

    const id = getRouterParam(event, 'id');
    if (!id) return useReturnResponse(event, badRequestError);

    const imap_client = await useConnectClient();
    await useGetImapMailbox(imap_client, 'INBOX');
    
    const search = { uid: id };

    const { error: messageError } = await useDeleteMessage(imap_client, search);
    if (messageError) return useReturnResponse(event, internalServerError);
    
    return useReturnResponse(event, {
        status: {
            success: true,
            code: 200,
            message: "Bericht succesvol verwijderd"
        }
    })
})