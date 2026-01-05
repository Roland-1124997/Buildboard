<template>
	<div class="">
		<div class=" pb-[5.5rem] md:pb-0">
			<div v-if="store.files.length > 0" class="space-y-3">
				<div class="mb-3">
					<h2 class="text-sm font-bold text-gray-800">{{ store.files.length }} {{ store.files.length === 1 ? "document" : "documenten" }}</h2>
				</div>

				<div class="grid gap-3 md:grid-cols-2">
					<div v-for="(file, index) in store.files" :key="index" class="z-10 flex items-center w-full gap-3 p-3 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50 group hover:border-gray-300">
						<div class="flex-shrink-0">
							<div class="flex items-center justify-center w-12 h-12 rounded-lg" :class="file.metadata.icon.background">
								<icon name="akar-icons:file" size="1.45rem" :class="file.metadata.icon.color" />
							</div>
						</div>

						<div class="flex items-start justify-between w-full gap-3">
							<div class="flex-1 overflow-hidden">
								<p class="text-sm font-medium text-gray-900 truncate max-w-40 md:max-w-60" :title="file.name">
									{{ file.name.charAt(0).toUpperCase() + file.name.slice(1).split(".")[0] }}
								</p>
								<div class="flex items-center gap-1 text-[0.73rem] md:text-sm -mt-[0.10rem]">
									<span :class="file.metadata.icon.color" class="font-semibold">{{ file.metadata.label }}</span>
									<span aria-hidden class="text-gray-500">•</span>
									<span class="text-gray-500">{{ file.metadata.size }}</span>
								</div>
								<div class="flex items-center gap-2 text-xs text-gray-500 capitalize">
									<NuxtTime locale="nl" weekday="long" year="numeric" month="short" day="2-digit" hour="2-digit" minute="2-digit" :datetime="file.metadata.updated_at" />
								</div>
							</div>

							<div class="flex flex-shrink-0 gap-x-2">
								<button @click="store.patch(file)" class="text-gray-500 transition-colors rounded-lg hover:text-orange-600" :title="!file.published ? 'Maak zichtbaar' : 'Verbergen'" :aria-label="!file.published ? 'Maak zichtbaar' : 'Verbergen'">
									<icon :name="file.published ? 'akar-icons:link-on' : 'akar-icons:link-off'" size="1.1rem" />
								</button>

								<button @click="store.preview(file)" class="text-gray-500 transition-colors rounded-lg hover:text-green-600" title="Voorbeeld" aria-label="Bekijk voorbeeld van bestand">
									<icon name="akar-icons:eye" size="1.1rem" />
								</button>

								<button @click="store.download(file)" class="text-gray-500 transition-colors rounded-lg hover:text-blue-600" title="Download" aria-label="Download bestand">
									<icon name="akar-icons:download" size="1.1rem" />
								</button>

								<button @click="store.remove(file)" class="text-gray-500 transition-colors rounded-lg hover:text-red-600" title="Verwijderen" aria-label="Verwijder bestand">
									<icon name="akar-icons:trash-can" size="1.1rem" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-else class="py-16 text-center">
				<div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
					<icon name="akar-icons:file" class="w-8 h-8 text-gray-400" />
				</div>
				<p class="text-sm font-medium text-gray-900">Geen documenten</p>
				<p class="mt-1 text-xs text-gray-500">Gebruik de upload knop om documenten toe te voegen</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: "authorized",
	});

	useSeoMeta({
		title: "Storage Dashboard",
		description: "Overzicht van opslag en bestanden.",
		ogTitle: "Storage Dashboard",
		ogDescription: "Overzicht van opslag en bestanden.",
		ogUrl: "/storage",
		ogImage: "/icons/icon_512.png",
		twitterTitle: "Storage Dashboard",
		twitterDescription: "Overzicht van opslag en bestanden.",
		twitterImage: "/icons/icon_512.png",
		twitterCard: "summary",
	});

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
		link: [
			{
				rel: "icon",
				type: "image/png",
				href: "/icons/icon_512.png",
			},
		],
	});

	useSearch();

	const store = useStorage();

</script>
