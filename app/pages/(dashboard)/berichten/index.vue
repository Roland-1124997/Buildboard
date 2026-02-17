<template>
	<div class="grid flex-1 grid-cols-1 overflow-hidden h-[77dvh] md:h-[74dvh] md:grid-cols-2">
		<div class="z-10 md:pr-4 md:border-r">
			<div class="flex-1 h-full overflow-y-auto">
				<UtilsEmailsPagination v-if="store.pagination.total > 1"/>
				<UtilsEmailsCardSkeleton v-if="store.loading" />
				<template v-else>
					<UtilsEmailsError v-if="store.messages.length === 0"/>
					<ClientOnly v-else >
						<UtilsEmailsCard/>
						<template #fallback>
							<UtilsEmailsCardSkeleton />
						</template>
					</ClientOnly>
				</template>
			</div>
		</div>
		<UtilsEmailsPreview />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Berichten Dashboard",
		description: "Bekijk en beheer al je berichten, e-mails en notificaties op één plek.",
		ogTitle: "Berichten Dashboard",
		ogDescription: "Bekijk en beheer al je berichten, e-mails en notificaties op één plek.",
		ogUrl: "/berichten",
		ogImage: "/icons/icon_512.png",
		twitterTitle: "Berichten Dashboard",
		twitterDescription: "Bekijk en beheer al je berichten, e-mails en notificaties op één plek.",
		twitterImage: "/icons/icon_512.png",
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

	// ***************************************************************************

	const store = useNotifications();
</script>
