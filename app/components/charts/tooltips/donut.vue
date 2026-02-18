<template>
	<div class="w-64 p-1 rounded-xl">
		<div class="flex items-center gap-1">
			<div class="w-3 h-3 rounded-full" :style="localStyle"></div>
			<p class="font-bold text-normal">
				{{ localLabel }}
			</p>
		</div>
		<p class="text-sm">
			Er zijn <strong> {{ localData }}</strong> {{ active }} geweest in deze periode.
		</p>
	</div>
</template>

<script setup lang="ts">
	const { categories, active, values } = defineProps({
		categories: {
			type: Object as () => Record<string, { name: string; color: string }>,
			required: true,
		},
		active: {
			type: String,
			required: false,
			default: "bezoekers",
		},
		values: {
			type: Object as () => { label: string; [key: string]: any } | null,
		},
	});

	const localLabel = computed(() => values?.label || "");
	const localData = computed(() => useFormatDuration(values?.[values.label] || 0));
	const localStyle = computed(() => {
		const color = categories[values?.label?.toLowerCase() || ""]?.color || "";

		return { background: color };
	});
</script>
