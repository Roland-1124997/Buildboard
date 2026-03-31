export default defineTask({
	meta: {
		name: "endpoints",
		description: "fetch its's own status endpoint to keep the connection alive and prevent cold starts",
	},
	async run() {
		const heartBeat = useHeartBeat("endpoints");

		const server = useSupaBaseServer();
		const { data, error } = await server.from("endpoints").select("*");

		if (error) {
			await heartBeat.error();
			return { result: "Error", error };
		}

		data.forEach(async (request) => {
			await fetch(request.endpoint).catch(() => {});
		});

		await heartBeat.success();
		return { result: "Success" };
	},
});
