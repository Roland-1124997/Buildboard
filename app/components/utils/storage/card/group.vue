<template>
	<UtilsDisplayGroup :name="title" :data="files" :text="['bestand', 'bestanden']" />

	<div class="grid gap-3 md:grid-cols-2">
		<div v-for="(file, index) in files" :key="index" class="z-10 flex items-center w-full gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 group hover:border-gray-300">
			<UtilsStorageCard :file />
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		files: {
			type: Array as () => FileData[],
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
	});
</script>
