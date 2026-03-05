<template>
	<div v-for="i in count" :key="i" :class="['p-4', name == 'pages' ? 'h-[6.6rem]' : 'h-[6.85rem]', 'bg-gray-100 border border-gray-200 rounded-lg animate-pulse']">
		<div class="h-5 mb-3 bg-gray-200 rounded"></div>
		<div class="grid grid-cols-3 gap-2">
			<div class="h-4 bg-gray-200 rounded"></div>
			<div class="h-4 bg-gray-200 rounded"></div>
			<div class="h-4 bg-gray-200 rounded"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		count: number;
		name: string;
	}>();
</script>
