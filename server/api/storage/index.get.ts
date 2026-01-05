export default defineSupabaseEventHandler(async (event, { server }) => {

    const page = Number(getQuery(event).page || 1);
    const search = String(getQuery(event).search || '');
    const filter = String(getQuery(event).filter || '');

    const { items, start, end } = useMakePagination(100, page);

    const files: any[] = [];
    const query = server.from('attachments')
        .select('*', { count: "exact" })
        .order('updated_at', { ascending: false })
        .range(start, end);

    if (search)  query.or(`name.ilike.%${search}%,label.ilike.%${search}%`);
    if (filter && filter !== 'alles') query.or(`label.ilike.%${filter}%`);
    
    const { count, data, error } = await query;
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
            media: `/attachments/${file.name}`,
            metadata: {
                size: formatSize(fileMeta.metadata.size),
                label: file.label,
                mimetype: fileMeta.metadata.mimetype,
                created_at: fileMeta.created_at,
                updated_at: fileMeta.updated_at,
                icon: {
                    color: getIconColor(types, file.name.split('.').pop() || ''),
                    background: getIconBackground(types, file.name.split('.').pop() || ''),
                },
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
        pagination: {
            page: page,
            total: Math.ceil((count ?? 1) / items)
        },
        data: files
    })

});

