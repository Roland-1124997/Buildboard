<template>
	<div class="grid gap-3 md:grid-cols-3">
		<div v-for="page in data" :key="page.path"
			class="pb-3 border-b border-gray-200 md:p-4 md:pr-3 last:border-b-0 md:last:border-b md:border md:rounded-lg">
			<h3 class="mb-1 text-xl font-bold text-blue-900">{{ page.label }}</h3>
			<div class="space-y-2">
				<div v-for="header in headers" :key="header.name"
					class="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
					<span class="text-xs font-medium text-gray-600">{{ header.name }}</span>
					<span
						class="inline-flex items-center justify-center min-w-14 px-3 py-1.5 text-sm font-bold rounded-lg"
						:style="{ backgroundColor: `${header.color}15`, color: header.color }">
						{{ useFormatDuration(page[header.name.toLowerCase()]) }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	const { data, categories } = defineProps({
		data: {
			type: Object as () => Record<string, any>[],
			required: true,
		},
		categories: {
			type: Object as () => Record<string, { name: string; color: string }>,
			required: true,
		},
	});

	const headers = Object.values(categories).map((category) => {
		return category;
	});
</script>
