export default defineSupabaseEventHandler(async (event, { server }) => {

    const files: any[] = [];

    const { data, error } = await server.from('attachments').select('*').order('updated_at', { ascending: false });
    if (error) return useReturnResponse(event, internalServerError);

    const { data: meta, error: metaError } = await server.storage.from('stores').list()
    if (metaError) return useReturnResponse(event, internalServerError);

    for (const file of data) {

        const fileMeta = meta.find((m) => m.name === file.name)
        if (!fileMeta || !meta) continue;

        files.push({
            id: file.id,
            name: file.name,
            published: file.published,
            media: {
                preview: `/attachments/${file.name}`
            },
            metadata: {
                size: fileMeta.metadata.size,
                mimetype: fileMeta.metadata.mimetype,
                created_at: fileMeta.created_at,
                updated_at: fileMeta.updated_at,
                extension: fileMeta.name.split('.').pop() as string
            }
        });
    }

    if (error) return useReturnResponse(event, internalServerError);

    return useReturnResponse(event, {
        status: {
            code: 200,
            message: 'Bestanden succesvol opgehaald',
            success: true
        },
        data: files
    })

});

