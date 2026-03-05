<template>
	<div v-for="meta in data" :key="meta.label" class="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
		<div class="flex items-center pb-1 mb-2 border-b">
			<template v-if="name === 'countries'">
				<icon :name="`twemoji:flag-${useCounryName(meta.label, 'en').replace(' ', '-').toLowerCase()}`" class="object-cover w-6 h-6 mr-2 rounded-sm" />
				<p class="text-sm font-semibold text-gray-900">{{ useCounryName(meta.label) }}</p>
			</template>

			<template v-else-if="name === 'pages'">
				<p class="text-sm font-semibold text-gray-900">{{ meta.label }}</p>
			</template>
		</div>

		<div class="grid grid-cols-3 gap-2 text-center">
			<div>
				<h3 class="text-xs font-semibold text-blue-800">Bezoekers</h3>
				<p class="font-medium text-gray-900">{{ meta.bezoekers }}</p>
			</div>

			<div>
				<h3 class="text-xs font-semibold text-blue-800">Bezoeken</h3>
				<p class="font-medium text-gray-900">{{ meta.bezoeken }}</p>
			</div>
			<div>
				<h3 class="text-xs font-semibold text-blue-800">Weergaven</h3>
				<p class="font-medium text-gray-900">{{ meta.weergaven }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		data: {
			label: string;
			bezoekers: number;
			bezoeken: number;
			weergaven: number;
		}[];
		name: string;
	}>();
</script>
