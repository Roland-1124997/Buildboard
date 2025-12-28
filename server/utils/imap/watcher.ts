import { EventEmitter } from 'events';
import type { ImapFlow } from 'imapflow';
import { setTimeout as wait } from 'timers/promises';

import { randomUUID } from "crypto";


let started = false;
let stopped = false;

let events = [
    'flags', 'exists', 'expunge'
]

const imapEmitter = new EventEmitter();

export const startImapWatcher = async () => {
    if (started) return;

    started = true;
    stopped = false;

    let client: ImapFlow

    const connectAndWatch = async () => {

        client = await useConnectClient();
        await useGetImapMailbox(client, 'INBOX');

        events.forEach((event: any) => {
            client.on(event, async () => {
                imapEmitter.emit('new', randomUUID());
            });
        });

        while (!stopped) await (client as any).idle?.();

        await useCloseImapClient(client);
    };

    (async () => {
        let attempt = 0;
        while (!stopped) {

            await connectAndWatch();
            if (stopped) break;

            attempt++;
            const delay = Math.min(30_000, 1000 * Math.pow(2, Math.min(6, attempt))); // max 30s
            await wait(delay);
        }
    })();
};

export const stopImapWatcher = async () => {
    stopped = true;
    started = false;
};

export const getImapEmitter = () => imapEmitter;

const getFilteredMessageUids = async (client: ImapFlow, filter: string, search: string) => {

    const seen_filter = filter === "gelezen"
    const unseen_filter = filter === "ongelezen"
    const has_search = !!search;

    
    if ((unseen_filter || seen_filter) && has_search) {
        
        const uids = await client.search({
            seen: seen_filter,
            or: [
                { subject: search },
                { from: search },
                { body: search }
            ]

        });
        return uids === false ? [] : uids;
    }

    if (unseen_filter) {
        const uids = await client.search({ seen: false });
        return uids === false ? [] : uids;
    }

    if (seen_filter) {
        const uids = await client.search({ seen: true });
        return uids === false ? [] : uids;
    }

    if (has_search) {
        const uids = await client.search({ 
            or: [
                { subject: search },
                { from: search },
                { body: search }
            ]
        });
        return uids === false ? [] : uids;
    }

    return [];
};

const buildFetchCriteria = (uids: number[], page: number, limit: number, start: number, end: number) => {
    if (uids.length > 0) {
        const sortedUids = [...uids].sort((a, b) => b - a);
        const pageUids = sortedUids.slice((page - 1) * limit, page * limit);

        return pageUids.join(',');
    }

    return `${start}:${end}`;
};

const fetchMessagesWithCriteria = async (client: ImapFlow, criteria: string) => {
    return await useFetchImapMessages(client, criteria, {
        uid: true,
        envelope: true,
        internalDate: true,
        flags: true,
        source: true,
    });
};

export const fetchImapMessages = async (client: ImapFlow, options: {
    limit: number,
    page: number,
    filter?: string,
    search?: string
}) => {

    let totalMessages = 0;

    const mailbox = await useGetImapMailbox(client, 'INBOX');
    const unseen = await unseenMessagesCount(client);
    const filter = options.filter as string;
    const search = options.search as string;

    const seen_filter = filter === "gelezen"
    const unseen_filter = filter === "ongelezen"
    const has_search = !!search;
    const messageUids = await getFilteredMessageUids(client, filter, search);

    if (seen_filter || unseen_filter || has_search) totalMessages = messageUids.length;
    else totalMessages = mailbox.exists || 0;

    const { page, total, start, end } = makeImapPagination(
        totalMessages,
        options.page as number,
        options.limit as number
    );

    if (page > total || totalMessages === 0) return { data: null, unseen, error: true };

    const criteria = buildFetchCriteria(messageUids, page, options.limit as number, start, end);
    const messages = await fetchMessagesWithCriteria(client, criteria);

    return {
        data: {
            messages,
        },
        unseen,
        pagination: {
            current_page: page,
            total_Pages: total,
        }
    };
};
