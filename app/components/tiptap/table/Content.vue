<template>
	<li>
		<button
			@click="onItemClick(node)"
			:data-item-index="node.itemIndex"
			class="flex items-start gap-1 p-1 px-6 text-sm font-semibold rounded hover:bg-blue-100 hover:text-blue-950"
			:class="[{ 'text-blue-950 bg-blue-100': active, 'text-gray-500': !active }]"
			:style="paddingStyle">
			<span>{{ node.level }}.</span>
			<span class="text-left line-clamp-2">{{ node.textContent }}</span>
		</button>

		<ul v-if="node.children && node.children.length" class="mt-1 space-y-1">
			<TiptapTableContent :active-id="activeId" :on-item-click="onItemClick" v-for="child in node.children" :key="child.id" :node="child" />
		</ul>
	</li>
</template>

<script setup lang="ts">
	defineOptions({ name: "TocItem" });

	const { node, activeId } = defineProps<{
		node: any;
		activeId: string | null;
		onItemClick: (node: any) => void;
	}>();

	const paddingStyle = computed(() => {
		const level = node.level ? Math.max(0.5, node.level - 1) : 0;
		const rem = level * 0.75;
		return { paddingLeft: `${rem}rem` };
	});

	const active = computed(() => {
		return node.id == activeId;
	});
</script>
