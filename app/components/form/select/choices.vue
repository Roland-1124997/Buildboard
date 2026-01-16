<template>
	<div class="w-full">
		<div class="flex flex-col gap-3 sm:flex-row">
			<button type="button" @click="props.onConfirm()" class="flex items-center justify-center flex-1 gap-2 px-5 py-3 text-sm font-medium text-white transition-colors duration-150 bg-red-600 border border-red-600 rounded-lg outline-none md:text-base focus:outline-none focus:ring-2 focus:ring-red-400 hover:bg-red-700" aria-label="Bevestigen">
				<icon name="akar-icons:check" class="w-4 h-4" aria-hidden="true" />
				<span> {{ props.message.confirm }} </span>
			</button>

			<button type="button" @click="props.onCancel()" class="flex items-center justify-center flex-1 gap-2 px-5 py-3 text-sm font-medium text-gray-700 transition-colors duration-150 bg-white border border-gray-300 rounded-lg outline-none md:text-base focus:outline-none focus:ring-2 focus:ring-gray-400 hover:bg-gray-50 hover:border-gray-400" aria-label="Annuleren">
				<icon name="akar-icons:cross" class="w-4 h-4" aria-hidden="true" />
				<span> {{ props.message.cancel }} </span>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
	defineProps<{
		props: Record<string, any>;
	}>();
</script>
