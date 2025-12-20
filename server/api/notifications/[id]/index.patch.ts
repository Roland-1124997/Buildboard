
export default defineSupabaseEventHandler(async (event, { server }) => {

    const imap_client = await useConnectClient();
    await useGetImapMailbox(imap_client, 'INBOX');

    const id = getRouterParam(event, 'id');
    const action = getQuery(event).action;

    const search = { uid: id };
    const seen = [
        '\\Seen',
    ];

    const { error } = action == 'markAsSeen'
        ? await useAddMessageFlags(imap_client, search, seen)
        : await useRemoveMessageFlags(imap_client, search, seen);

    await useCloseImapClient(imap_client);

    if (error) return useReturnResponse(event, internalServerError);
   

    return useReturnResponse(event, {
        status: {
            success: true,
            code: 200,
            message: action == 'markAsSeen' ? "Bericht succesvol als gelezen gemarkeerd" : "Bericht succesvol als ongelezen gemarkeerd"
        }
    })
})