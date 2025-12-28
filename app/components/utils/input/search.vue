<template>
	<field :name="name" v-slot="{ field }: any" v-model="search">
		<div class="relative w-full">
			<label :for="name" class="sr-only">{{ label }}</label>
			<input v-bind="field" :disabled :id="name" :placeholder type="search" class="w-full p-2 pl-10 text-gray-900 transition border rounded-xl bg-white/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 disabled:opacity-60 disabled:cursor-not-allowed" autocomplete="off" spellcheck="true" role="searchbox" :aria-label="label" />
			<icon name="akar-icons:search" class="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none left-3 top-1/2" aria-hidden="true" />
		</div>
	</field>
</template>

<script setup lang="ts">
	const store = useNotifications();
	const route = useRoute();

	const { search, setSearch } = useSearch({
		callback: async (params: { filter: string; search: string; page: number }) => {
			if (route.path === "/berichten") await store.refresh(params);
		},
	});

	watchDebounced(
		search,
		async (newValue) => {
			await setSearch(newValue);
		},
		{ debounce: 1000, maxWait: 5000 }
	);

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
