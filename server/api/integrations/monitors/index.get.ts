const { betterstackSourceToken } = useRuntimeConfig();

const headers = { Authorization: `Bearer ${betterstackSourceToken}` };
const baseUrl = `https://uptime.betterstack.com/api/v2`;

const Groups = new Map<number, { name: string }>();

const useFetchMonitorsGroup = async () => {
	const url = `${baseUrl}/monitor-groups`;

	let data: Record<string, any> | null = null;
	let error = null;

	try {
		data = await $fetch<Record<string, any>>(url, { headers });

		data.data.forEach((group: any) => {
			Groups.set(Number(group.id), { name: group.attributes.name });
		});
	} catch (err) {
		error = err;
	}

	return { data, error };
};

const useFetchMonitors = async () => {
	const url = `${baseUrl}/monitors`;

	let data: Record<string, any> | null = null;
	let error = null;

	try {
		data = await $fetch<Record<string, any>>(url, { headers });
	} catch (err) {
		error = err;
	}

	return { data, error };
};

export default defineSupabaseEventHandler(async (event) => {
	const search = String((getQuery(event).search as string) ?? "").toLowerCase();

	const { data, error } = await useFetchMonitors();

	if (error && !data?.data) return useReturnResponse(event, internalServerError);

	await useFetchMonitorsGroup();

	const monitors =
		data?.data
			.map((monitor: any) => {
				const id = monitor.attributes.monitor_group_id;
				const group = Groups.get(id);

				return {
					...monitor,
					attributes: {
						...monitor.attributes,
						monitor_group_name: group?.name ?? null,
					},
				};
			})

			.filter((monitor: any) => {
				const monitor_name = monitor.attributes?.pronounceable_name?.toLowerCase().includes(search);
				const group_name = monitor.attributes?.monitor_group_name?.toLowerCase().includes(search);

				return monitor_name || group_name;
			}) ?? [];

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Monitors fetched successfully",
			success: true,
		},
		data: {
			count: monitors.length,
			monitors: Object.groupBy(monitors, (monitor: any) => monitor.attributes.monitor_group_name),
		},
	});
});
