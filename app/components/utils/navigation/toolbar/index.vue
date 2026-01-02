<template>
	<div>
		<div class="hidden">
			<label class="sr-only" for="file">file</label>
			<input id="file" ref="inputRef" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar" @change="handleFileSelect" class="sr-only" />
		</div>

		<div v-if="selected" :class="selected ? ' md:hidden' : ''" class="z-40 flex items-center h-16 gap-2 px-4 bg-white border-b lg:px-4">
			<button @click="notificationsStore.backToList()" class="flex items-center justify-center gap-2 px-3 py-[0.64rem] text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg md:hidden hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Terug naar berichtenlijst">
				<icon name="akar-icons:chevron-left" class="w-4 h-4" aria-hidden="true" />
				<span class="sr-only">Overzicht</span>
			</button>

			<button @click="notificationsStore.compose(selected)" class="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 border border-blue-500 rounded-lg hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Beantwoord dit bericht">
				<span>Beantwoorden</span>
			</button>
		</div>


		<div v-if="toolbar" class="z-40">

			<div v-if="toolbar?.groupWithFilters" :class="[selected ? ' hidden md:flex' : '', !toolbar?.groupWithFilters ? '' : 'flex-wrap']" class="flex items-center justify-between w-full gap-3 px-4 py-2 bg-white border-b md:flex-nowrap lg:px-4">
				<UtilsInputSearch v-if="toolbar.search" name="search" :label="toolbar.search.label" :placeholder="toolbar.search.placeholder" :store />

				<div class="flex items-center w-full gap-[0.35rem]">
					<UtilsButtonImportant v-for="(btn, index) in toolbar.buttons" :key="index" :to="btn.to" :icon-name="btn.iconName" :description="btn.description" :isButton="btn.isButton" :isSmall="btn.isSmall" @click="btn.onClick === 'triggerFileSelect' ? triggerFileSelect() : btn.onClick === 'refresh' ? storageStore.refresh() : undefined" />
					<UtilsButtonFilter v-if="toolbar.filters" :setFilter :filter :store v-for="filterItem in toolbar.filters" :always-show-label="filterItem.alwaysShowLabel" :key="filterItem.type" :type="filterItem.type" :iconName="filterItem.iconName" :label="filterItem.label" :short-label="filterItem.shortLabel" :color="filterItem.color" :large="filterItem.large" />
				</div>

			</div>

			<div v-else class="flex flex-col items-center justify-between w-full gap-3 px-4 py-2 bg-white border-b md:flex-nowrap lg:px-4">

				<div class="flex items-center justify-between w-full gap-2 " >
					<UtilsInputSearch v-if="toolbar.search" name="search" :label="toolbar.search.label" :placeholder="toolbar.search.placeholder" :store />
					<UtilsButtonImportant v-if="toolbar.buttons" v-for="(btn, index) in toolbar.buttons" :key="index" :to="btn.to" :icon-name="btn.iconName" :description="btn.description" :isButton="btn.isButton" :isSmall="btn.isSmall" @click="btn.onClick === 'triggerFileSelect' ? triggerFileSelect() : btn.onClick === 'refresh' ? storageStore.refresh() : undefined" />
				</div>

				<div v-if="toolbar.filters" class="flex items-center justify-between w-full gap-2 ">
					<UtilsButtonFilter :setFilter :filter :store v-for="filterItem in toolbar.filters" :always-show-label="filterItem.alwaysShowLabel" :key="filterItem.type" :type="filterItem.type" :iconName="filterItem.iconName" :label="filterItem.label" :short-label="filterItem.shortLabel" :color="filterItem.color" :large="filterItem.large" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	
	const storageStore = useStorage();
	const notificationsStore = useNotifications();

	const route = useRoute();
	const selected = computed(() => notificationsStore.selected || route.query.id || null);

	const { toolbar, store } = defineProps<{
		toolbar: ToolBar | undefined;
		store: StoreType | undefined;
	}>();

	const fallbackFilter = computed(() => toolbar?.fallbackFilter || null);

	const { filter, setFilter } = useFilter({
		enableWatch: true,
		fallbackFilter: fallbackFilter,
		callback: async (params) => {
			if (store && store.refresh) await store.refresh(params);
			else await initilizeStore(params);
		},
	});

	const inputRef = ref<HTMLInputElement | null>(null);

	const triggerFileSelect = () => inputRef.value?.click();

	const handleFileSelect = async (event: Event) => {
		const input = event.target as HTMLInputElement;

		if (input.files) {
			await storageStore.upload(input.files);
			input.value = "";
		}
	};

	const initilizeStore = async (params: { filter?: string; page?: number }) => {
		const storeName = toolbar?.store;

		if (storeName) {
			const pinia = useNuxtApp().$pinia;
			const currentStore = (pinia as any)._s.get(storeName) as StoreType;
			if (currentStore && currentStore.refresh) await currentStore.refresh(params);
		}
	};


</script>
