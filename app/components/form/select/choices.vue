<template>
	<div>
		<div class="p-2 border rounded-lg bg-gray-50">
			<div v-if="props.type == 'bericht'">
				<h2 class="text-lg font-bold text-gray-800">
					{{ props.message.from.name }}
				</h2>

				<h3 class="text-sm font-medium text-gray-600">
					{{ props.message.subject }}
				</h3>

				<p class="mt-1 text-sm text-gray-700 text-balance line-clamp-3">
					{{ props.message.preview }}
				</p>
			</div>

			<div v-else-if="props.type == 'artikel'">
				<h2 class="text-lg font-bold text-gray-800">
					{{ props.message.title }}
				</h2>

				<img :src="props.message.thumbnail_url" alt="Artikel afbeelding" class="object-cover w-full h-48 my-3 border rounded-lg md:h-56 bg-gray-50" />

				<p class="mt-1 text-sm text-gray-700 text-balance line-clamp-3">
					{{ props.message.description }}
				</p>
			</div>

			<div v-else-if="props.type == 'bestand'">
				<h2 class="text-lg font-bold text-gray-800">
					{{ props.message.name }}
				</h2>

				<p class="mt-1 text-sm text-gray-700 text-balance line-clamp-3">Grootte: {{ props.message.metadata.size }}</p>
			</div>
		</div>

		<div class="flex flex-col items-center w-full gap-2 pb-6 mt-2 md:flex-row md:pb-auto">
			<button type="button" @click="props.onConfirm()" class="flex items-center justify-center flex-1 w-full gap-2 px-4 py-2 text-sm font-medium text-blue-800 transition-colors duration-200 bg-blue-100 border border-blue-400 rounded-lg outline-none focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-blue-200 hover:border-blue-500" aria-label="Bevestigen">
				<icon name="akar-icons:check" class="w-4 h-4" aria-hidden="true" />
				<span>
					Ja verwijder het
					{{ props.type }}
				</span>
			</button>

			<button type="button" @click="props.onCancel()" class="flex items-center justify-center flex-1 w-full gap-2 px-4 py-2 text-sm font-medium text-gray-800 transition-colors duration-200 bg-gray-100 border border-gray-400 rounded-lg outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 hover:bg-gray-200 hover:border-gray-500" aria-label="Annuleren">
				<icon name="akar-icons:cross" class="w-4 h-4" aria-hidden="true" />
				<span>
					Nee, ik wil het
					{{ props.type }}
					behouden
				</span>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
	defineProps<{
		props: Record<string, any>;
	}>();
</script>
