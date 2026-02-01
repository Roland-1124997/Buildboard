<template>
	<template v-if="data && !loading">
		<article v-for="statistic in data" :key="statistic.label" class="z-10 flex items-center w-full gap-2 p-2 border rounded-lg bg-gray-50 md:gap-3 md:p-3">
			<div class="flex items-center justify-center p-2 text-white rounded-lg select-none shrink-0 md:p-3" :style="{ backgroundColor: `${statistic.color}` }">
				<icon :name="statistic.icon" class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
			</div>
			<div class="flex-1 min-w-0">
				<h2 class="text-xs font-semibold text-gray-600 truncate md:text-sm">{{ statistic.label }}</h2>
				<div class="flex items-center justify-between gap-2">
					<h3 class="text-base font-extrabold text-gray-900 truncate md:text-xl">{{ useFormatDuration(statistic.value, statistic.format) }}</h3>

					<p :title="`${useFormatDuration(statistic.difference, statistic.format)}`" class="shrink-0">
						<span :class="statistic.positive ? 'text-green-800' : 'text-red-800'" class="text-xs font-medium md:text-sm">
							<span aria-hidden="true">{{ statistic.positive ? "▲" : "▼" }}</span>
							{{ useFormatDuration(statistic.percentage) }}%
						</span>
					</p>
				</div>
			</div>
		</article>
	</template>
	<template v-else>
		<article v-for="i in 4" :key="i" class="z-10 flex items-center w-full gap-2 p-2 bg-white border rounded-lg md:gap-3 md:p-3 animate-pulse">
			<div class="flex items-center justify-center p-2 bg-gray-200 rounded-lg shrink-0 md:p-3">
				<div class="w-5 h-5 bg-gray-300 rounded md:w-6 md:h-6"></div>
			</div>

			<div class="flex-1 min-w-0">
				<div class="w-20 h-3 mb-2 bg-gray-200 rounded"></div>
				<div class="flex items-center justify-between gap-2">
					<div class="w-16 h-5 bg-gray-300 rounded"></div>
					<div class="w-12 h-3 bg-gray-200 rounded"></div>
				</div>
			</div>
		</article>
	</template>
</template>

<script setup lang="ts">
	defineProps({
		data: {
			type: Array as () => Array<{
				label: string;
				value: number;
				difference: number;
				percentage: number;
				positive: boolean;
				format: boolean;
				icon: string;
				color: string;
			}>,
			required: false,
			default: () => null,
		},
		loading: {
			type: Boolean,
			required: false,
			default: false,
		},
	});
</script>
