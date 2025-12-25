export default defineSupabaseEventHandler(async (event) => {

    const nowDate = new Date();
    const endAt = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 23, 59, 59, 999).getTime();
    const startAt = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() - 7, 0, 0, 0, 0).getTime(); // 7 dagen geleden

    const limit = getQuery(event).limit ? Number(getQuery(event).limit) : 5;

    const { data, error } = await useFetchAnalytics("stats",{
        startAt, endAt, unit: 'day',
        timezone: 'Europe/Amsterdam'
    });

    if (error || !data) return useReturnResponse(event, internalServerError);

    const { data: pages, error: pagesError } = await useFetchMetrics("path", {
        startAt, endAt, unit: 'day',
        timezone: 'Europe/Amsterdam', type: 'path', limit
    });

    if (pagesError || !pages) return useReturnResponse(event, internalServerError);

    return useReturnResponse(event, {
        status: {
            code: 200,
            success: true,
            message: 'Statistieken succesvol opgehaald'
        },
        data: {
            statistics: [
                {
                    ...calculateValues({
                        label: 'Unieke bezoekers',
                        value: data.visitors,
                        previous: data.comparison.visitors,
                        format: false
                    })
                },
                {
                    ...calculateValues({
                        label: 'Bezoeken',
                        value: data.visits,
                        previous: data.comparison.visits,
                        format: false
                    })
                },
                {
                    ...calculateValues({
                        label: 'Weergaven',
                        value: data.pageviews,
                        previous: data.comparison.pageviews,
                        format: false
                    })
                },
                {
                    ...calculateValues({
                        label: 'Gem. sessieduur',
                        value: data.totaltime / data.visits,
                        previous: data.comparison.totaltime / data.comparison.visits,
                        format: true
                    })
                }
            ],

            metrics: {
                pages: {
                    categories: {
                        bezoekers: {
                            name: "Bezoekers",
                            color: "#6f97ed",
                        },
                        weergaven: {
                            name: "Weergaven",
                            color: "#2563eb",
                        },
                        bezoeken: {
                            name: "Bezoeken",
                            color: "#1542a3",
                        },
                    },
                    values: calculateMetrics(pages)
                }
            }
        }
    });
})


const calculateMetrics = (metrics: Record<string, any>) => {

    const result: Record<string, any> = metrics.map((item: Record<string, any>) => {

        const label = item.name.replace("/", "") || 'Index';

        return {
            label: label.charAt(0).toUpperCase() + label.slice(1),
            weergaven: item.pageviews,
            bezoekers: item.visitors,
            bezoeken: item.visits,
        }

    })

    result.sort((a: Record<string, any>, b: Record<string, any>) => b.weergaven - a.weergaven);

    return result;

}

const calculateValues = (options: { label: string, value: number, previous: number, format: Boolean }) => {

    const difference = calculateDifference(options.value, options.previous);
    const percentage = calculatePercentage(options.value, options.previous);
    const isPositive = positivePercentage(Number(percentage));

    return {
        label: options.label,
        value: options.value,
        difference: difference,
        percentage: `${percentage}%`,
        positive: isPositive,
        format: options.format
    }
}

const positivePercentage = (value: number) => {
    if (value > 0) return true;
    return false;
}

const calculateDifference = (current: number, previous: number, time: boolean = false) => {
    if (time) return (current - previous) / 10;
    return current - previous;
}

const calculatePercentage = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return (((current - previous) / previous) * 100).toFixed(0);
}
