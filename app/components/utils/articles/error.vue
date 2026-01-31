<template>
	<div class="h-[65vh] flex flex-col items-center justify-center md:h-[72vh] text-center">
		<div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
			<icon name="akar-icons:file" class="w-8 h-8 text-gray-400" />
		</div>

		<span v-if="search">
			<p class="mb-1 text-base font-semibold text-gray-900">Geen artikelen gevonden</p>
			<p class="mb-2 text-sm text-gray-700">Er zijn geen artikelen die overeenkomen met je zoekopdracht:</p>
			<div class="flex items-center justify-center w-full">
				<div class="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-md">
					<icon name="akar-icons:search" class="w-3 h-3" />
					<p>{{ search }}</p>
				</div>
			</div>
		</span>

		<span v-else>
			<p class="text-sm font-medium text-gray-900">Geen artikelen beschikbaar</p>
			<p class="mt-1 text-xs text-gray-500">Gebruik de knop hieronder om een nieuw artikel toe te voegen</p>
		</span>
	</div>
</template>

<script setup lang="ts">
	const { search } = useSearch();
</script>
