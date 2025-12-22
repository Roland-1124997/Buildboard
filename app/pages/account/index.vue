<template>
	<div class="relative z-10">
		
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: "authorized",
	});

	useSeoMeta({
		title: "Profiel Dashboard",
		description: "Bekijk en bewerk je profielinformatie.",
		ogTitle: "Profiel Dashboard",
		ogDescription: "Bekijk en bewerk je profielinformatie op Follio.",
		ogUrl: "/profile",
		ogImage: "/icons/icon_512.png",
		twitterTitle: "Profiel Dashboard",
		twitterDescription: "Bekijk en bewerk je profielinformatie op Follio.",
		twitterImage: "/icons/icon_512.png",
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
				href: "/icons/icon_512.png",
			},
		],
	});

</script>
