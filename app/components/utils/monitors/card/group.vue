<template>
	<UtilsDisplayGroup :name="title" :data="monitors" :text="['monitor', 'monitors']" />

	<div class="grid gap-3 md:grid-cols-2">
		<div v-for="(monitor, index) in monitors" :key="index" class="z-10 flex items-center w-full gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 group hover:border-gray-300">
			<UtilsMonitorsCard :monitor />
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		monitors: {
			type: Array as () => FileData[],
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
	});
</script>
