export default defineSupabaseEventHandler(async (event, { server }) => {

    const { data: articles, error } = await server.from('artikelen').select('*').order('updated_at', { ascending: false });

    if (error) return useReturnResponse(event, internalServerError);

    articles?.forEach((article: typeof articles[0] & { thumbnail_url?: string, content: any }) => {
        const content = article.content.content
        const { filtered } = useFilterParagraphs(content, 'image')
        article.thumbnail_url = filtered.value[0]?.attrs?.src || null;
    });

    return useReturnResponse(event, {
        status: {
            code: 200,
            success: true,
            message: "Artikelen succesvol opgehaald",
        },
        data: articles,
    });

});