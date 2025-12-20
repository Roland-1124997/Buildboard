<template>
	<div class="">
		<div class="sticky z-20 w-full pt-1 pb-3 mt-1 bg-white border-b -top-[0.05rem] md:-top-0">
			<div class="flex items-center justify-between w-full gap-2 text-2xl font-bold">
				<h1>Opslag</h1>
			</div>
			<p class="w-full text-gray-600 text-pretty">Overzicht van je opgeslagen bestanden en documenten deze kun je hier beheren.</p>

			<div class="flex items-center justify-between gap-2 p-1 pt-3 mt-1 border-t">

				<UtilsInputSearch 
					name="search" label="Zoek in bestanden"
					placeholder="Zoek bestanden..." v-model="query"
				/>

				<UtilsButtonImportant @click="triggerFileSelect"
					icon-name="akar-icons:cloud-upload"
					description="Bestanden uploaden"
					:isButton="true"
				/>

				<UtilsButtonImportant @click="storageStore.refresh"
					icon-name="akar-icons:arrow-right-left"
					description="Bestanden synchroniseren"
					:isButton="true"
				/>

			</div>

			<div class="hidden">
				<label class="sr-only " for="file">file</label>
				<input id="file"  ref="inputRef" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar" @change="handleFileSelect" class="sr-only " />
			</div>
		</div>

		<div class="mt-4">
			<div v-if="filteredFiles.length > 0" class="space-y-3">
				<div class="mb-3">
					<h2 class="text-sm font-bold text-gray-800">{{ filteredFiles.length }} {{ filteredFiles.length === 1 ? "document" : "documenten" }}</h2>
				</div>

				<div class="grid gap-3 md:grid-cols-2">
					<div v-for="(file, index) in filteredFiles" :key="index" class="z-10 flex items-center w-full gap-3 p-3 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50 group hover:border-gray-300">
						<div class="flex-shrink-0">
							<div class="flex items-center justify-center w-12 h-12 rounded-lg" :class="storageStore.getIconBackground(types, file.metadata.extension)">
								<icon name="akar-icons:file" size="1.45rem" :class="storageStore.getIconColor(types, file.metadata.extension)" />
							</div>
						</div>

						<div class="flex items-start justify-between w-full gap-3">
							<div class="flex-1 overflow-hidden">
								<p class="text-sm font-medium text-gray-900 truncate max-w-40 md:max-w-60" :title="file.name">
									{{ file.name.charAt(0).toUpperCase() + file.name.slice(1).split(".")[0] }}
								</p>
								<div class="flex items-center gap-1 text-[0.73rem] md:text-sm -mt-[0.10rem]">
									<span :class="storageStore.getIconColor(types, file.metadata.extension)" class="font-semibold">{{ storageStore.getTypeLabel(types, file.metadata.extension) }}</span>
									<span aria-hidden class="text-gray-500">•</span>
									<span class="text-gray-500">{{ storageStore.formatSize(file.metadata.size) }}</span>
								</div>
								<div class="flex items-center gap-2 text-xs text-gray-500 capitalize">
									<NuxtTime locale="nl" weekday="long" year="numeric" month="short" day="2-digit" hour="2-digit" minute="2-digit" :datetime="file.metadata.updated_at" />
								</div>
							</div>

							<div class="flex flex-shrink-0 gap-x-2">
								<button @click="storageStore.patch(file)" class="text-gray-500 transition-colors rounded-lg hover:text-orange-600" :title="!file.published ? 'Maak zichtbaar' : 'Verbergen'" :aria-label="!file.published ? 'Maak zichtbaar' : 'Verbergen'">
									<icon :name="file.published ? 'akar-icons:link-on' : 'akar-icons:link-off'" size="1.1rem" />
								</button>

								<button @click="storageStore.preview(file)" class="text-gray-500 transition-colors rounded-lg hover:text-green-600" title="Voorbeeld" aria-label="Bekijk voorbeeld van bestand">
									<icon name="akar-icons:eye" size="1.1rem" />
								</button>

								<button @click="storageStore.download(file)" class="text-gray-500 transition-colors rounded-lg hover:text-blue-600" title="Download" aria-label="Download bestand">
									<icon name="akar-icons:download" size="1.1rem" />
								</button>

								<button @click="storageStore.remove(file)" class="text-gray-500 transition-colors rounded-lg hover:text-red-600" title="Verwijderen" aria-label="Verwijder bestand">
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

	const storageStore = useStorageStore();
	const route = useRoute();
	const router = useRouter();

	const query = ref(route.query.search || "");
	const inputRef = ref<HTMLInputElement | null>(null);

	const types: FileType[] = [
		{ extension: "png", label: "Afbeelding", color: "text-green-800", background: "bg-green-50" },
		{ extension: "jpg", label: "Afbeelding", color: "text-green-800", background: "bg-green-50" },
		{ extension: "jpeg", label: "Afbeelding", color: "text-green-800", background: "bg-green-50" },
		{ extension: "gif", label: "Afbeelding", color: "text-green-800", background: "bg-green-50" },
		{ extension: "webp", label: "Afbeelding", color: "text-green-800", background: "bg-green-50" },
		{ extension: "pdf", label: "PDF Document", color: "text-red-800", background: "bg-red-50" },
		{ extension: "doc", label: "Word Document", color: "text-blue-800", background: "bg-blue-50" },
		{ extension: "docx", label: "Word Document", color: "text-blue-800", background: "bg-blue-50" },
		{ extension: "xls", label: "Excel Sheet", color: "text-green-800", background: "bg-green-50" },
		{ extension: "xlsx", label: "Excel Sheet", color: "text-green-800", background: "bg-green-50" },
		{ extension: "ppt", label: "PowerPoint", color: "text-orange-800", background: "bg-orange-50" },
		{ extension: "pptx", label: "PowerPoint", color: "text-orange-800", background: "bg-orange-50" },
		{ extension: "txt", label: "Tekstbestand", color: "text-gray-800", background: "bg-gray-50" },
		{ extension: "zip", label: "ZIP Archief", color: "text-purple-800", background: "bg-purple-50" },
	];

	const handleFileSelect = async (event: Event) => {
		const input = event.target as HTMLInputElement;

		if (input.files) {
			await storageStore.upload(input.files);
			input.value = "";
		}
	};

	const triggerFileSelect = () => inputRef.value?.click();

	const filteredFiles = computed(() => {
		const result = storageStore.filter(query.value as string, types);

		if (!query.value) {
			router.replace({
				query: {
					...route.query,
					search: undefined,
				},
			});
		} else {
			router.replace({
				query: {
					...route.query,
					search: query.value,
				},
			});
		}

		return result;
	});
</script>
