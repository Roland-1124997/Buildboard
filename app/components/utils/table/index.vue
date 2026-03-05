<template>
	<div class="overflow-x-auto bg-white border border-gray-200 rounded-lg">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-4 py-3 text-sm font-medium tracking-wider text-left text-gray-700 uppercase">
						{{ categories[0]?.label }}
					</th>
					<th v-for="category in categories.slice(1, categories.length)" :key="category.value" class="py-3 text-sm font-medium tracking-wider text-center text-gray-700 uppercase" :class="getCategoryClass(category.value)">
						{{ category.label }}
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				<tr v-for="meta in data" :key="meta.label" class="transition-all hover:bg-gray-50 group">
					<td v-if="name == 'pages'" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
						<icon name="akar-icons:panel-right" class="object-cover w-6 h-6 mr-2 text-blue-600 rounded-sm opacity-50 group-hover:opacity-100" />
						{{ meta.label }}
					</td>

					<td v-else-if="name == 'devices'" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
						<icon :name="`akar-icons:${meta.label.toLowerCase()}-device`" class="object-cover w-6 h-6 mr-2 text-blue-600 rounded-sm opacity-50 group-hover:opacity-100" />
						{{ meta.label }}
					</td>

					<td v-else-if="name == 'countries'" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
						<icon :name="`twemoji:flag-${useCounryName(meta.label, 'en').replace(' ', '-').toLowerCase()}`" class="object-cover w-6 h-6 mr-2 rounded-sm opacity-70 group-hover:opacity-100" />
						{{ useCounryName(meta.label) }}
					</td>

					<td v-for="category in categories.slice(1, categories.length)" :key="category.value" class="py-3 text-sm text-center text-gray-700 border whitespace-nowrap" :class="getCategoryClass(category.value)">
						{{ formatCategoryValue(meta, category.value) }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		name: {
			type: String as PropType<"pages" | "countries" | "devices">,
			required: true,
		},
		data: {
			type: Array<{
				label: string;
				weergaven: number;
				bezoekers: number;
				bezoeken: number;
				bounces: number;
				totaltime: number;
			}>,
			required: true,
		},
		categories: {
			type: Array<{ label: string; value: string }>,
			default: () => [],
		},
	});

	const getCategoryClass = (value: string) => {
		const classes: Record<string, string> = {
			weergaven: "",
			bezoekers: "hidden sm:table-cell",
			bezoeken: "hidden md:table-cell",
			bounces: "hidden md:table-cell",
			totaltime: "hidden md:table-cell",
		};
		return classes[value] || "";
	};

	const formatCategoryValue = (meta: any, category: string) => {
		if (category === "bounces") return `${useFormatDuration(meta[category])}%`;
		if (category === "totaltime") return useFormatDuration(meta[category], true);
		return useFormatDuration(meta[category]);
	};
</script>
