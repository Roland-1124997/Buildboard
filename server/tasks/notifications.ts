
const { startAt, endAt } = formulateDates("week");
const timezone = 'Europe/Amsterdam';

export default defineTask({
    meta: {
        name: "notifications",
        description: "sends a notification every week with visits page statistics",
    },
    async run() {

        const { data, error } = await useFetchAnalytics(`stats:week`, {
            startAt, endAt, unit: 'day',
            timezone
        })

        if (error) return { result: "Error fetching analytics data" };

        const { message, title } = formatWeeklyStatsMessage(data);

        useSendServiceWorkerPushEvent({
            data: {
                id: "weekly-stats",
                title: title,
                message: message,
                url: "/?filter=week",
            },
            events: {
                incoming: true,
                update: false,
                deleted: false,
            }
        });

        return { result: "Success" };

    },
});
