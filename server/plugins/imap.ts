import { consola } from "consola";


export default defineNitroPlugin(async () => {

    try {
        await startImapWatcher();
        consola.success('IMAP watcher started successfully.');
    } catch (error) {
        consola.error('Failed to start IMAP watcher:', error);
    }
});
