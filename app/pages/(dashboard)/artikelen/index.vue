<template>
	<div class="grid gap-4 grid-cols-1 md:grid-cols-3 pb-[5.5rem] md:pb-0">
		<UtilsArticlesCardSkeleton v-if="store.loading" />
		<UtilsArticlesCard v-else-if="store.articles.length > 0" :articles="store.articles" />
		<UtilsArticlesError v-else class="col-span-3 " />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Artikelen Dashboard",
		description: "Overzicht van alle artikelen en blog posts.",
		ogTitle: "Artikelen Dashboard",
		ogDescription: "Overzicht van alle artikelen en blog posts.",
		ogUrl: "/artikelen",
		ogImage: "/icons/icon_512.svg",
		twitterTitle: "Artikelen Dashboard",
		twitterDescription: "Overzicht van alle artikelen en blog posts.",
		twitterImage: "/icons/icon_512.svg",
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
				href: "/icons/icon_512.png",
			},
		],
	});

	const store = useArticles();

</script>
