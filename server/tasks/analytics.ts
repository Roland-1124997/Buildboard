const filters = {
	vandaag: "vandaag",
	week: "week",
	maand: "maand",
	jaar: "jaar",
};

export default defineTask({
	meta: {
		name: "analytics",
		description: "Collect analytics data and cache it for faster retrieval",
	},
	async run() {
		const heartBeat = useHeartBeat("analytics");

		return await Promise.all(
			Object.entries(filters).map(async ([_key, value]) => {
				const { startAt, endAt } = formulateDates(value);

				const timezone = "Europe/Amsterdam";
				const cache = useStorage("cache");

				const cacheKey = `${value}-Europe-Amsterdam`;

				await Promise.all([
					cache.removeItem(`nitro:functions:analytics:stats:${cacheKey}.json`),
					cache.removeItem(`nitro:functions:analytics:device:${cacheKey}.json`),
					cache.removeItem(`nitro:functions:analytics:path:${cacheKey}.json`),
					cache.removeItem(`nitro:functions:analytics:country:${cacheKey}.json`),
				]);

				await Promise.all([
					useFetchAnalytics(`stats:${value}`, {
						startAt,
						endAt,
						unit: "day",
						timezone,
					}),

					useFetchMetrics(`device:${value}`, {
						startAt,
						endAt,
						unit: "day",
						timezone,
						type: "device",
					}),

					useFetchMetrics(`path:${value}`, {
						startAt,
						endAt,
						unit: "day",
						timezone,
						type: "path",
					}),

					useFetchMetrics(`country:${value}`, {
						startAt,
						endAt,
						unit: "day",
						timezone,
						type: "country",
					}),
				]);
			}),
		)

			.then(async () => {
				await heartBeat.success();
				return { result: "Success" };
			})

			.catch(async () => {
				await heartBeat.error();
				return { result: "Error fetching analytics data" };
			});
	},
});
