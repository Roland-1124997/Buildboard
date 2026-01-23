
export default defineMultiFactorVerificationEventHandler(async (event) => {

    const imap_client = await useConnectClient();
    await useGetImapMailbox(imap_client, 'INBOX');
    
    const id = getRouterParam(event, 'id');

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