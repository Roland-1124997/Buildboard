export default defineSupabaseEventHandler(async (event) => {

    const filter = String(getQuery(event).filter || 'vandaag');
    
    const { startAt, endAt } = formulateDates(filter);

    const { data, error } = await useFetchAnalytics(`stats:${filter}`, {
        startAt, endAt, unit: 'day',
        timezone: 'Europe/Amsterdam'
    });

    if (error || !data) return useReturnResponse(event, internalServerError);

    const { data: devices, error: devicesError } = await useFetchMetrics(`device:${filter}`, {
        startAt, endAt, unit: 'day',
        timezone: 'Europe/Amsterdam', type: 'device'
    });

    if (devicesError || !devices) return useReturnResponse(event, internalServerError);

    const { data: pages, error: pagesError } = await useFetchMetrics(`path:${filter}`, {
        startAt, endAt, unit: 'day',
        timezone: 'Europe/Amsterdam', type: 'path'
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
                        color: '#6f97ed',
                        icon: 'akar-icons:person',
                        format: false
                    })
                },
                {
                    ...calculateValues({
                        label: 'Bezoeken',
                        value: data.visits,
                        previous: data.comparison.visits,
                        color: "#2563eb",
                        icon: 'akar-icons:airplay-video',
                        format: false
                    })
                },
                {
                    ...calculateValues({
                        label: 'Weergaven',
                        value: data.pageviews,
                        previous: data.comparison.pageviews,
                        color: "#1542a3",
                        icon: 'akar-icons:eye',
                        format: false
                    })
                },
                {
                    ...calculateValues({
                        label: 'Gem. sessieduur',
                        value: data.totaltime / data.visits,
                        previous: data.comparison.totaltime / data.comparison.visits,
                        color: "#0c2970",
                        icon: 'akar-icons:alarm',
                        format: true
                    })
                }
            ],

            metrics: {
                devices: {
                    categories: {
                        desktop: {
                            name: "Desktop",
                            color: "#93c5fd",
                        },
                        mobile: {
                            name: "Mobile",
                            color: "#60a5fa",
                        },
                        laptop: {
                            name: "Laptop",
                            color: "#3b82f6",
                        },
                        tablet: {
                            name: "Tablet",
                            color: "#2563eb",
                        },
                    },
                    values: calculateMetrics(devices)
                },
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


const formulateDates = (filter: string) => {

    const nowDate = new Date();

    const year = nowDate.getFullYear();
    const month = nowDate.getMonth();
    const day = nowDate.getDate();

    const endAt = new Date(year, month, day, 23, 59, 59, 999).getTime();
    
    let startAt = 0

    if (filter === 'vandaag') startAt = new Date(year, month, day, 0, 0, 0, 0).getTime();
    if (filter === 'week') startAt = new Date(year, month, day - 7, 0, 0, 0, 0).getTime();
    if (filter === 'maand') startAt = new Date(year, month, day - 30, 0, 0, 0, 0).getTime();
    if (filter === 'jaar') startAt = new Date(year, month, day - 365, 0, 0, 0, 0).getTime();
    
    return { startAt, endAt };

}


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

const calculateValues = (options: { label: string, value: number, previous: number, color: string, icon: string, format: Boolean }) => {

    const difference = calculateDifference(options.value, options.previous);
    const percentage = calculatePercentage(options.value, options.previous);
    const isPositive = positivePercentage(Number(percentage));

    return {
        label: options.label,
        value: options.value,
        difference: difference,
        percentage: percentage,
        positive: isPositive,
        color: options.color,
        icon: options.icon,
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
