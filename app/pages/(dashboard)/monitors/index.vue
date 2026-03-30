<template>
	<div class="pb-[5.5rem] md:pb-0">
		<UtilsMonitorsCardSkeleton v-if="store.loading" />

		<div v-else-if="Object.keys(store.monitors).length > 0" class="space-y-3">
			<ClientOnly>
				<UtilsDisplayCount :text="['monitor', 'monitors']" :count="Number(store.count)" />
				<UtilsMonitorsCardGroup v-for="(grouped, title) in store.monitors" :key="title" :monitors="grouped" :title="String(title)" />
				<template #fallback>
					<UtilsMonitorsCardSkeleton />
				</template>
			</ClientOnly>
		</div>
		<UtilsDisplayError label="monitors" IconName="akar-icons:alarm" v-else />
	</div>
</template>

<script setup lang="ts">
	const store = useMonitor();

	useSeoMeta({
		title: "Insights - Monitors",
		description: "Bekijk een overzicht van al je monitors en hun huidige status.",
		ogTitle: "Insights - Monitors",
		ogDescription: "Bekijk een overzicht van al je monitors en hun huidige status.",
		ogUrl: "/monitors",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Monitors",
		twitterDescription: "Bekijk een overzicht van al je monitors en hun huidige status.",
		twitterImage: "/icons/icon_512-blue.png",
		twitterCard: "app",
	});

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
		link: [
			{
				rel: "icon",
				type: "image/png",
				href: "/icons/icon_512-blue.png",
			},
		],
	});
</script>
