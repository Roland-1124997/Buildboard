<template>
	
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
