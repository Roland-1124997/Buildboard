<template>
	<div class="flex select-none items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg w-fit">
		<icon name="akar-icons:dashboard" size="0.875rem" class="text-gray-500" />
		<span class="text-xs font-semibold text-gray-600">
			{{ name === "null" ? "Niet gekoppeld" : `${name}` }}
		</span>
		<span class="text-xs text-gray-400">•</span>
		<span class="text-xs text-gray-500">{{ data.length }} {{ data.length === 1 ? text[0] : text[1] }}</span>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		data: {
			type: Array,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		text: {
			type: Array as unknown as () => [string, string],
			required: true,
		},
	});
</script>
