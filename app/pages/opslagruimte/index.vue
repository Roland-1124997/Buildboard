<template>
	<div class="">
		<div class=" pb-[5.5rem] md:pb-0">
			<div v-if="filteredFiles.length > 0" class="space-y-3">
				<div class="mb-3">
					<h2 class="text-sm font-bold text-gray-800">{{ filteredFiles.length }} {{ filteredFiles.length === 1 ? "document" : "documenten" }}</h2>
				</div>

				<div class="grid gap-3 md:grid-cols-2">
					<div v-for="(file, index) in filteredFiles" :key="index" class="z-10 flex items-center w-full gap-3 p-3 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50 group hover:border-gray-300">
						<div class="flex-shrink-0">
							<div class="flex items-center justify-center w-12 h-12 rounded-lg" :class="store.getIconBackground(types, file.metadata.extension)">
								<icon name="akar-icons:file" size="1.45rem" :class="store.getIconColor(types, file.metadata.extension)" />
							</div>
						</div>

						<div class="flex items-start justify-between w-full gap-3">
							<div class="flex-1 overflow-hidden">
								<p class="text-sm font-medium text-gray-900 truncate max-w-40 md:max-w-60" :title="file.name">
									{{ file.name.charAt(0).toUpperCase() + file.name.slice(1).split(".")[0] }}
								</p>
								<div class="flex items-center gap-1 text-[0.73rem] md:text-sm -mt-[0.10rem]">
									<span :class="store.getIconColor(types, file.metadata.extension)" class="font-semibold">{{ store.getTypeLabel(types, file.metadata.extension) }}</span>
									<span aria-hidden class="text-gray-500">•</span>
									<span class="text-gray-500">{{ store.formatSize(file.metadata.size) }}</span>
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

	const types: FileType[] = [
		{ extension: "png", label: "Afbeelding", color: "text-blue-800", background: "bg-blue-50" },
		{ extension: "jpg", label: "Afbeelding", color: "text-blue-800", background: "bg-blue-50" },
		{ extension: "jpeg", label: "Afbeelding", color: "text-blue-800", background: "bg-blue-50" },
		{ extension: "gif", label: "Afbeelding", color: "text-blue-800", background: "bg-blue-50" },
		{ extension: "webp", label: "Afbeelding", color: "text-blue-800", background: "bg-blue-50" },
		{ extension: "pdf", label: "PDF Document", color: "text-red-800", background: "bg-red-50" },
		{ extension: "doc", label: "Word Document", color: "text-indigo-800", background: "bg-blue-50" },
		{ extension: "docx", label: "Word Document", color: "text-indigo-800", background: "bg-blue-50" },
		{ extension: "xls", label: "Excel Sheet", color: "text-green-800", background: "bg-green-50" },
		{ extension: "xlsx", label: "Excel Sheet", color: "text-green-800", background: "bg-green-50" },
		{ extension: "ppt", label: "PowerPoint", color: "text-orange-800", background: "bg-orange-50" },
		{ extension: "pptx", label: "PowerPoint", color: "text-orange-800", background: "bg-orange-50" },
		{ extension: "txt", label: "Tekstbestand", color: "text-gray-800", background: "bg-gray-50" },
		{ extension: "zip", label: "ZIP Archief", color: "text-purple-800", background: "bg-purple-50" },
	];

	const store = useStorage();
	const { search } = useSearch();

	await store.initialPayload();

	const filteredFiles = computed(() => {
		return store.filter(search.value as string, types);
	});
</script>
