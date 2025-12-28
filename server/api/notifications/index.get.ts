
export default defineSupabaseEventHandler(async (event, { server }) => {

    const imap_client = await useConnectClient();
    await useGetImapMailbox(imap_client, 'INBOX');

    const page = Number(getQuery(event).page || 1);
    const search = String(getQuery(event).search || '');
    const filter = String(getQuery(event).filter || '');

    const { data, unseen, error, pagination } = await fetchImapMessages(imap_client, {
        limit: 4, page, filter, search
    });

    await useCloseImapClient(imap_client);

    if (error || !data) return useReturnResponse(event, {
        status: {
            code: 200,
            success: false,
            message: 'Er zijn geen berichten gevonden',
        },
        data: {
            messages: [],
            unseen: unseen
        }
    })

    return useReturnResponse(event, {
        status: {
            code: 200,
            success: true,
            message: 'Berichten succesvol opgehaald',
        },
        pagination: {
            page: pagination.current_page,
            total: pagination.total_Pages,
        },
        data: {
            ...data,
            unseen
        }
    });
});
