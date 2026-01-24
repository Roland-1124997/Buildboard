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

    if (search) {

        const { data: title, error } = await server.from('artikelen')
            .select('id').ilike('title', `%${search}%`).single();

        if (!error && title) query.eq('article_id', title.id)
        else query.ilike('name', `%${search}%`);
    }

    if (filter && filter !== 'alles') query.ilike('label', `%${filter}%`);

    const { count, data, error } = await query;

    if (error) return useReturnResponse(event, internalServerError);

    const { data: meta, error: metaError } = await server.storage.from('stores').list()
    
    if (metaError) return useReturnResponse(event, internalServerError);

    for (const file of data) {

        let title = null;

        if (file.article_id) {
            const { data } = await server.from('artikelen').select('title').eq('id', file.article_id || "").single();
            title = data?.title;
        }

        const fileMeta = meta.find((m) => m.name === file.name)
        if (!fileMeta || !meta) continue;

        files.push({
            id: file.id,
            article_name: title,
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
        data: Object.groupBy(files, (file) => file.article_name)
    })

});

