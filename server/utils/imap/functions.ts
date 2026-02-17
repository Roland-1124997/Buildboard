import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import sanitize from 'sanitize-html'
import { JSDOM } from 'jsdom';

const { IMAP_HOST, IMAP_PORT, IMAP_SECURE, IMAP_USER, IMAP_PASS } = useRuntimeConfig();

export const sanitizeHtml = (html: string) => {
    let output = sanitize(html, {
        allowedTags: sanitize.defaults.allowedTags.filter(tag => tag !== 'img'),
        allowedAttributes: {
            ...sanitize.defaults.allowedAttributes,
            '*': ['class'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
        disallowedTagsMode: 'discard',
    });

    output = output.replace(
        /<hr([^>]*)>/gi,
        '<hr$1 style="margin-top:16px;margin-bottom:16px;">'
    );

    output = output.replace(
        /<h1([^>]*)>/gi,
        '<h1$1 style="margin:0;padding:0;font-size:2em;line-height:1.08em;padding-top:16px;font-weight:600;padding-bottom:16px;text-align:left">'
    );

    output = output.replace(
        /<h2([^>]*)>/gi,
        '<h2$1 style="margin:0;padding:0;font-size:1.5em;line-height:1.08em;padding-top:14px;font-weight:600;padding-bottom:14px;text-align:left">'
    );

    output = output.replace(
        /<h3([^>]*)>/gi,
        '<h3$1 style="margin:0;padding:0;font-size:1.25em;line-height:1.08em;padding-top:12px;font-weight:600;padding-bottom:12px;text-align:left">'
    );

    output = output.replace(
        /<h4([^>]*)>/gi,
        '<h4$1 style="margin:0;padding:0;font-size:1.1em;line-height:1.08em;padding-top:10px;font-weight:600;padding-bottom:10px;text-align:left">'
    );

    output = output.replace(
        /<h5([^>]*)>/gi,
        '<h5$1 style="margin:0;padding:0;font-size:1em;line-height:1.08em;padding-top:8px;font-weight:600;padding-bottom:8px;text-align:left">'
    );

    output = output.replace(
        /<h6([^>]*)>/gi,
        '<h6$1 style="margin:0;padding:0;font-size:0.9em;line-height:1.08em;padding-top:6px;font-weight:600;padding-bottom:6px;text-align:left">'
    );

    return output.replaceAll('  ', '').trim()
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
    const threadmap = new Map<string, string>();

    for await (let message of client.fetch(criteria, fetchOptions)) {

        let html = '';
        let preview = '';
        let attachments = [];
        let previewText = '';

        if (!message.source) continue;

        const emailSubject = message.envelope?.subject;
        const stripedSubject = emailSubject?.split(':')[1]?.trim() || emailSubject?.trim();

        if (stripedSubject) {
            threadmap.set(stripedSubject, threadmap.get(stripedSubject) || crypto.randomUUID());
            message.threadId = threadmap.get(stripedSubject);
        }

        const mail = await simpleParser(message.source);

        const document = new JSDOM(mail.html || '');
        const body = document.window.document.body

        body.querySelectorAll('p').forEach((element, index) => {
            if (index < 3) previewText += element.textContent + ' ';
        });

        html = sanitizeHtml(mail.html || "") || mail.textAsHtml || '';

        attachments = mail.attachments;
        preview = previewText || mail.text || mail.textAsHtml || '';
        preview = preview
            .replace(/https?:\/\/[^\s]+/g, '')
            .replace(/\[/g, '')
            .replace(/\]/g, '')
            .replace(/\)/g, ') ')
            .replace(/\s+/g, ' ')
            .trim()

        messages.push({
            id: message.id,
            threadId: message.threadId || null,
            uid: message.uid,
            subject: message.envelope?.subject,
            date: message.envelope?.date,
            from: message.envelope?.from?.[0],
            flags: message.flags ? Array.from(message.flags) : [],
            attachments, preview, html,
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
