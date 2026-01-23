
export default defineMultiFactorVerificationEventHandler(async (event, { server }) => {

    const id = getRouterParams(event).id;

    const { data, error } = await server.from('attachments').select('*').eq('id', id).single();
    if (error || !data) return useReturnResponse(event, internalServerError);

    const { error: storageError } = await server.storage.from('stores').remove([data.name]);
    if (storageError) return useReturnResponse(event, internalServerError);

    return useReturnResponse(event, {
        status: {
            code: 200,
            message: 'Bestand succesvol verwijderd',
            success: true
        },
    });

});

