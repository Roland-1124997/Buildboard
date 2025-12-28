import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import sanitize from 'sanitize-html'
import { JSDOM } from 'jsdom';

const { IMAP_HOST, IMAP_PORT, IMAP_SECURE, IMAP_USER, IMAP_PASS } = useRuntimeConfig();

export const sanitizeHtml = (html: string) => {

    let output = sanitize(html, {
        allowedTags: sanitize.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
            ...sanitize.defaults.allowedAttributes,
            '*': ['class']
        },
        allowedSchemes: ['http', 'https', 'mailto', 'data']
    })

    return output;
}

export const useConnectClient = async () => {

    const client = new ImapFlow({
        host: IMAP_HOST,
        port: Number(IMAP_PORT),
        secure: IMAP_SECURE === 'true',
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: IMAP_USER,
            pass: IMAP_PASS,
        },
        logger: false
    });

    await client.connect();

    return client;
}

export const useCloseImapClient = async (client: ImapFlow) => {
    await client.logout();
}

export const useGetImapMailbox = async (client: ImapFlow, mailbox: string) => {
    return await client.mailboxOpen(mailbox);
}

export const useReleaseImapMailbox = async (lock: any) => {
    lock.release();
}

export const useFetchImapMessages = async (client: ImapFlow, criteria: any, fetchOptions: any) => {
    const messages = [];

    for await (let message of client.fetch(criteria, fetchOptions)) {


        let html = '';
        let preview = '';
        let attachments = [];
        let previewText = '';

        if (!message.source) continue;

        const mail = await simpleParser(message.source);

        const document = new JSDOM(mail.html || '');
        const body = document.window.document.body

        body.querySelectorAll('p').forEach((element, index) => {
            if (index < 3) previewText += element.textContent + ' ';
        });

        html = sanitizeHtml(mail.html || "") || mail.textAsHtml || '';
        attachments = mail.attachments;
        preview = previewText || mail.text || mail.textAsHtml || '';

        messages.push({
            id: message.id,
            messageId: mail.messageId || null,
            threadId: mail.inReplyTo || (mail.references && mail.references[0]) || mail.messageId || null,
            uid: message.uid,
            subject: message.envelope?.subject,
            date: message.envelope?.date,
            from: message.envelope?.from?.[0],
            inReplyTo: mail.inReplyTo || null,
            flags: message.flags ? Array.from(message.flags) : [],
            attachments, preview, html,
            origin: "email",
            references: mail.references || null,
        });
    }

    return messages.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

}


export const useAddMessageFlags = async (client: ImapFlow, search: any, flags: string[]) => {

    let data = null;
    let error = null;

    await client.messageFlagsAdd(search, flags).then((response) => {
        data = response;
    }).catch((err) => {
        error = err;
    });

    return { data, error };
}

export const useRemoveMessageFlags = async (client: ImapFlow, search: any, flags: string[]) => {

    let data = null;
    let error = null;

    await client.messageFlagsRemove(search, flags).then((response) => {
        data = response;

    }).catch((err) => {
        error = err;
    });

    return { data, error };
}

export const useDeleteMessage = async (client: ImapFlow, search: any) => {
    let data = null;
    let error = null;

    await client.messageDelete(search).then((response) => {
        data = response;
    }).catch((err) => {
        error = err;
    });

    return { data, error };

}




export const unseenMessagesCount = async (client: ImapFlow) => {
    const count = await client.search({ seen: false });
    return count === false ? 0 : count.length;
}

export const makeImapPagination = (totalItems: number, currentPage: number, itemsPerPage: number) => {
    const total = Math.ceil(totalItems / itemsPerPage);
    const page = currentPage

    const end = totalItems - (page - 1) * itemsPerPage;
    const start = Math.max(end - itemsPerPage + 1, 1);

    return { page, total, start, end };
}
