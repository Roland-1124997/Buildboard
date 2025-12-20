
export default defineSupabaseEventHandler(async (event, { server }) => {

    const imap_client = await useConnectClient();
    await useGetImapMailbox(imap_client, 'INBOX');

    const list = await fetchImapNewMessages(imap_client, { messages: 100 });
    list.messages.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    await useCloseImapClient(imap_client);

    return useReturnResponse(event, { 
        status: {
            code: 200,
            success: true,
            message: 'Notificaties succesvol opgehaald',
        },
        data: list
    });

});
