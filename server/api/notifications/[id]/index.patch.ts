export default defineSupabaseEventHandler(async (event, { server }) => {

    const id = getRouterParam(event, 'id');
    if (!id) return useReturnResponse(event, badRequestError);

    const { imap_client, imap_error } = await useConnectClient();
    if (imap_error || !imap_client) return useReturnResponse(event, internalServerError);

    await useGetImapMailbox(imap_client, 'INBOX');

    const action = getQuery(event).action;
    const search = { uid: id };
    const seen = [
        '\\Seen',
    ];

    const { error } = action == 'markAsSeen'
        ? await useAddMessageFlags(imap_client, search, seen)
        : await useRemoveMessageFlags(imap_client, search, seen);

    const unseen = await unseenMessagesCount(imap_client)

    const data = await useFetchImapSingleMessage(imap_client, search.uid, {
        uid: true,
        envelope: true,
        internalDate: true,
        flags: true,
        source: true
    }, { uid: true });

    if (data) {
        const updated = await upsertImapMessageCache(data);
        if (!updated) await refreshImapMessagesCache(imap_client, true);
    }

    await useCloseImapClient(imap_client);

    if (error) return useReturnResponse(event, internalServerError);

    return useReturnResponse(event, {
        status: {
            success: true,
            code: 200,
            message: action == 'markAsSeen' ? "Bericht succesvol als gelezen gemarkeerd" : "Bericht succesvol als ongelezen gemarkeerd"
        },
        data: {
            message: data,
            unseen
        }
    })
})