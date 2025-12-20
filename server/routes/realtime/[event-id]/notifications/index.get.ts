
export default defineSupabaseEventHandler(async (event) => {

    await startImapWatcher();

    const emitter = getImapEmitter();

    const eventStream = createEventStream(event);

    const push = (payload: unknown) => {
        eventStream.push(JSON.stringify(payload));
    };

    emitter.on('new', push);

    eventStream.onClosed(async () => {
        emitter.off('new', push);
    });

    return eventStream.send();

});
