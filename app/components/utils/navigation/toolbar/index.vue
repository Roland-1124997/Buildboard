<template>
	<div>
		<div class="hidden">
			<label class="sr-only" for="file">file</label>
			<input id="file" ref="inputRef" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.jpg,.jpeg,.png,.gif,.webp" @change="handleFileSelect" class="sr-only" />
		</div>

		<div v-if="toolbar" class="z-40">
			<div v-if="toolbar?.groupWithFilters" :class="[!toolbar?.groupWithFilters ? '' : 'flex-wrap']" class="flex items-center justify-between w-full gap-3 px-4 py-2 bg-white border-b md:flex-nowrap lg:px-4">
				<UtilsInputSearch :toolbar v-if="toolbar.search" name="search" :label="toolbar.search.label" :placeholder="toolbar.search.placeholder" />

				<div class="flex items-center w-full gap-[0.35rem]">
					<UtilsButtonImportant v-for="(btn, index) in toolbar.buttons" :key="index" :to="btn.to" :icon-name="btn.iconName" :description="btn.description" :isButton="btn.isButton" :isSmall="btn.isSmall" @click="btn.onClick === 'triggerFileSelect' ? triggerFileSelect() : btn.onClick === 'refresh' ? storageStore.refresh() : undefined" />
					<UtilsButtonFilter v-if="toolbar.filters" v-for="filterItem in toolbar.filters" :activeType :loading :setFilter :filter :always-show-label="filterItem.alwaysShowLabel" :key="filterItem.type" :type="filterItem.type" :iconName="filterItem.iconName" :label="filterItem.label" :short-label="filterItem.shortLabel" :color="filterItem.color" :large="filterItem.large" />
				</div>
			</div>

			<div v-else class="flex flex-col items-center justify-between w-full gap-3 px-4 py-2 bg-white border-b md:flex-nowrap lg:px-4">
				<div class="flex items-center justify-between w-full gap-2">
					<UtilsInputSearch :toolbar v-if="toolbar.search" name="search" :label="toolbar.search.label" :placeholder="toolbar.search.placeholder"  />
					<UtilsButtonImportant v-if="toolbar.buttons" v-for="(btn, index) in toolbar.buttons" :key="index" :to="btn.to" :icon-name="btn.iconName" :description="btn.description" :isButton="btn.isButton" :isSmall="btn.isSmall" @click="btn.onClick === 'triggerFileSelect' ? triggerFileSelect() : btn.onClick === 'refresh' ? storageStore.refresh() : undefined" />
				</div>

				<div v-if="toolbar.filters" class="flex items-center justify-between w-full gap-2">
					<UtilsButtonFilter v-for="filterItem in toolbar.filters" :activeType :loading :setFilter :filter :always-show-label="filterItem.alwaysShowLabel" :key="filterItem.type" :type="filterItem.type" :iconName="filterItem.iconName" :label="filterItem.label" :short-label="filterItem.shortLabel" :color="filterItem.color" :large="filterItem.large" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const storageStore = useStorage();
	
	const { toolbar } = defineProps({
		toolbar: { type: Object as PropType<ToolBar>, default: null },
	});

	const fallbackFilter = computed(() => toolbar?.fallbackFilter || null);

	const { activeType, loading, filter, setFilter } = useFilter({
		enableWatch: true,
		fallbackFilter: fallbackFilter,
		callback: async (params) => {
			await useInitilizeStore(toolbar, params);
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

	
</script>
