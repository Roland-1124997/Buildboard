<template>
	<div class="relative z-10"></div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - Profiel",
		description: "Bekijk en bewerk je profielinformatie.",
		ogTitle: "Insights - Profiel",
		ogDescription: "Bekijk en bewerk je profielinformatie op Follio.",
		ogUrl: "/profile",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Profiel",
		twitterDescription: "Bekijk en bewerk je profielinformatie op Follio.",
		twitterImage: "/icons/icon_512-blue.png",
		twitterCard: "summary_large_image",
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
