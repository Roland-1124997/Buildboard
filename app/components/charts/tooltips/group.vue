<template>
	<div class="w-64 p-1 rounded-xl">
		<p class="font-bold text-normal">{{ localLabel }}</p>
		<div class="flex-col">
			<div class="flex items-center gap-2" v-for="(value, index) in categories">
				<div class="w-3 h-3 rounded-full" :style="{ background: value.color }"></div>

				<p class="text-sm">
					<strong>{{ useFormatDuration(localValues[value.name.toLowerCase()] || 0) }}</strong>
					{{ value.name }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { categories, values } = defineProps({
		categories: {
			type: Object as () => Record<string, { name: string; color: string }>,
			required: true,
		},
		values: {
			type: Object,
			required: false,
			default: null,
		},
	});

	const localLabel = computed(() => values?.label || "index");

	const localValues = computed(() => {
		const result: Record<string, number> = {};
		if (values) {
			Object.keys(values).forEach((key) => {
				if (key !== "label") {
					result[key] = values[key];
				}
			});
		}
		return result;
	});
</script>
