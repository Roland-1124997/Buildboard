<template>
	<aside class="pl-2 select-none">
		<nav class="mb-2 hidden md:inline md:w-64 h-[73vh] md:h-[76vh] overflow-y-auto">
			<h1 class="mb-2 text-lg font-semibold">Inhoudsopgave</h1>

			<ul v-if="Anchors.length > 1" class="flex flex-col space-y-1 overflow-auto">
				<TiptapTableContent :active-id="activeId" :on-item-click="onItemClick" v-for="node in Anchors" :key="node.id" :node="node" />
			</ul>
			<p v-else class="text-gray-500">Geen inhoudsopgave beschikbaar.</p>
		</nav>
	</aside>
</template>

<script setup lang="ts">
	const activeId = defineModel<string | null>({ required: false, default: null });

	defineProps<{
		Anchors: Anchor[];
	}>();

	const onItemClick = (node: any) => {
		const element = document.getElementById(node.id);

		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
			activeId.value = node.id;
		}
	};
</script>
