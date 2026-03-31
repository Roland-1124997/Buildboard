<template>
	<div class="w-full p-2">
		<div class="flex items-start justify-between gap-2">
			<div>
				<h2 class="text-base font-bold text-gray-900 capitalize">
					{{ monitor.attributes.public_name }}
				</h2>
				<p class="mt-1 text-sm font-medium text-gray-700">
					{{ monitor.attributes.explanation || "geen beschrijving beschikbaar" }}
				</p>
			</div>
			<span class="px-2 py-1 text-xs font-semibold rounded-lg" :class="monitor.attributes.status === 'operational' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
				{{ monitor.attributes.status }}
			</span>
		</div>
		<dl class="grid grid-cols-2 gap-2 mt-4 text-sm">
			<div class="p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 hover:bg-gray-100">
				<h2 class="mb-1 font-bold text-gray-900">Beschikbaarheid</h2>
				<p class="">{{ monitor.attributes.availability * 100 }}%</p>
			</div>
			<div class="p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 hover:bg-gray-100">
				<h2 class="mb-1 font-bold text-gray-900">
					<NuxtTime :datetime="individualStatus.day" locale="nl" day="2-digit" month="short" year="numeric" />
				</h2>
				<div>
					<p>{{ individualStatus.downtime_duration ? `Downtime: ${Math.floor(individualStatus.downtime_duration / 60)} min` : "Geen downtime" }}</p>
				</div>
			</div>
			<div class="col-span-2 p-3 rounded-lg md:p-4 bg-gray-50 group-hover:bg-gray-100 hover:bg-gray-100">
				<div class="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-0.5 md:gap-1">
					<div v-for="value in monitor.attributes.status_history.slice(-days)" :key="value.day" class="w-full aspect-square">
						<button
							@click="showIndividualStatus(value.day)"
							@mouseenter="showIndividualStatus(value.day)"
							class="relative flex items-center justify-center w-full h-full p-1 transition-all duration-200 rounded md:p-2 md:rouned-md hover:scale-105"
							:class="value.status === 'operational' ? 'bg-emerald-500' : 'bg-rose-500 '"
							:title="`${value.day}: ${value.status}`"></button>
					</div>
				</div>
			</div>
			<div class="col-span-2 p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 hover:bg-gray-100">
				<h2 class="mb-1 font-bold text-gray-900">Laatst gecontroleerd</h2>
				<NuxtTime locale="nl" year="numeric" month="short" day="2-digit" hour="2-digit" minute="2-digit" :datetime="monitor.attributes.last_checked_at" />
			</div>
		</dl>
	</div>
</template>

<script setup lang="ts">
	const { monitor } = defineProps({
		monitor: {
			type: Object,
			required: true,
		},
		days: {
			type: Number,
			default: 42,
		},
	});

	const individualStatus = ref(monitor.attributes.status_history.slice(-1)[0]);

	const showIndividualStatus = (day: string) => {
		monitor.attributes.status_history.forEach((history: { day: string; status: string }) => {
			if (history.day === day) individualStatus.value = history;
		});
	};
</script>
