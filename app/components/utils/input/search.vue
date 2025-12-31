<template>
	<field :name="name" v-slot="{ field }" >
		<div class="relative w-full">
			<label :for="name" class="sr-only">{{ label }}</label>
			<input :value="localSearch" @input="localSearch = ($event.target as HTMLInputElement).value" :id="name" :placeholder type="search" class="w-full p-2 pl-10 text-gray-900 transition border rounded-xl bg-white/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 disabled:opacity-60 disabled:cursor-not-allowed" autocomplete="off" spellcheck="true" role="searchbox" :aria-label="label" />
			<icon name="akar-icons:search" class="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none left-3 top-1/2" aria-hidden="true" />
		</div>
	</field>
</template>

<script setup lang="ts">
	
	const { store } = await useApiRoutes();

	const route = useRoute();
	const localSearch = ref();

	const { setSearch } = useSearch({
		localSearch,
		callback: async (params) => {
			
			if (route.path === "/berichten" ) {
				if(store.value.refresh) await store.value.refresh(params);
			}
		},
	});

	watchDebounced(localSearch, async (newValue) => {
		await setSearch(newValue);
	}, { debounce: 1000, maxWait: 5000 });

	const { name, initialValue } = defineProps({
		name: { type: String, required: true },
		label: { type: String, default: "text" },
		placeholder: { type: String, default: "" },
		required: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		initialValue: { type: String, default: "" },
	});

	const { value } = useField<string>(`${name}`);
	value.value = initialValue;
</script>
