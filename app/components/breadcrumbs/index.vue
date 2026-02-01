<template>
	<nav aria-label="Breadcrumb" class="py-1 select-none">
		<ol class="flex items-center gap-1 overflow-scroll">
			<li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center gap-1 last:truncate">
				<NuxtLink v-if="index < breadcrumbs.length - 1" :to="crumb.path" class="text-gray-600 transition-colors duration-200 hover:text-gray-900 hover:underline">
					{{ crumb.label }}
				</NuxtLink>

				<span v-else class="font-bold truncate text-gray-950 ">
					{{ crumb.label.split(' ')[0] }}
				</span>

				<span aria-hidden v-if="index < breadcrumbs.length - 1" class="text-gray-600 select-none"> / </span>
			</li>
		</ol>
	</nav>
</template>

<script setup lang="ts">
	interface Breadcrumb {
		label: string;
		path: string;
	}

	interface Props {
		items?: Breadcrumb[];
	}

	const props = defineProps<Props>();
	const route = useRoute();

	const breadcrumbs = computed(() => {
		if (props.items) return props.items;

		const paths = route.path.split("/").filter(Boolean);
		const crumbs: Breadcrumb[] = [{ label: "Dashboard", path: "/" }];

		let currentPath = "";
		paths.forEach((path) => {
			currentPath += `/${path}`;
			crumbs.push({
				label: path.replace(/-/g, " "),
				path: currentPath,
			});
		});

		return crumbs;
	});
</script>
