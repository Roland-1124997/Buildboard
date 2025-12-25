<template>
	<div class="grid flex-1 grid-cols-1 h-[69dvh] md:h-[74dvh] overflow-hidden md:grid-cols-2">
		<h1 class="sr-only">Notificaties Dashboard</h1>

		<div class="z-10 md:pr-4 md:border-r" :class="{ 'hidden md:block': store.selected }">
			<div class="flex-1 h-full overflow-y-auto">
				<div v-if="filteredMessages.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-gray-500 bg-white">
					<icon name="akar-icons:inbox" class="w-16 h-16 mb-4 text-gray-300" aria-hidden="true" />
					<h3 class="mb-2 text-lg font-medium">Geen berichten</h3>
					<p class="text-sm text-center">
						{{ search ? "Probeer een andere zoekterm" : "Er zijn momenteel geen notificaties" }}
					</p>
				</div>
				<div type="button" v-for="inbox in filteredMessages" :key="inbox.key" @click="store.selectMessage(inbox)" @keydown.enter="store.selectMessage(inbox)" :class="['w-full p-4 text-left cursor-pointer transition-all duration-150 border-b border-b-gray-200', store.selected?.id == inbox.id ? 'bg-gray-50' : 'bg-white hover:bg-gray-100']">
					<div class="flex items-start gap-3 select-none">
						<div class="flex-1">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div v-if="!inbox.flags.includes('\\Seen')" class="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full" role="status" aria-label="Ongelezen bericht"></div>
									<h2 class="font-semibold text-gray-900 truncate text-balance">
										{{ inbox.from.name || "Onbekende afzender" }}
									</h2>
								</div>

								<p class="text-sm text-gray-600 truncate">
									<NuxtTime :datetime="inbox.date" year="2-digit" month="2-digit" day="2-digit" hour="2-digit" minute="2-digit" />
								</p>
							</div>

							<p class="text-sm font-medium text-gray-600 truncate">
								{{ inbox.subject || "(Geen onderwerp)" }}
							</p>

							<p v-html="inbox.preview || 'Geen preview beschikbaar'" class="text-sm leading-relaxed text-gray-500 line-clamp-2"></p>

							<div class="flex items-center justify-start gap-2 mt-3">
								<button type="button" v-if="inbox.flags.includes('\\Seen')" @click.stop="store.markAsUnseen(inbox)" class="flex items-center justify-center gap-2 px-2 py-1 text-xs text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Markeer dit bericht als ongelezen">
									<icon name="material-symbols:mark-email-unread-outline-rounded" size="1rem" aria-hidden="true" />
									<span>Markeer als ongelezen</span>
								</button>
								<button type="button" v-else @click.stop="store.markAsSeen(inbox)" class="flex items-center justify-center gap-2 px-2 py-1 text-xs text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Markeer dit bericht als gelezen">
									<icon name="material-symbols:mark-email-read-outline-rounded" size="1rem" aria-hidden="true" />
									<span>Markeer als gelezen</span>
								</button>
								<button type="button" @click.stop="store.deleteMessage(inbox)" class="flex items-center justify-center gap-2 px-2 py-1 text-xs text-red-600 transition-colors duration-200 border border-red-300 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500" aria-label="Verplaats dit bericht naar prullenbak">
									<icon name="material-symbols:delete-outline-rounded" size="1rem" aria-hidden="true" />
									<span>Prullenbak</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<main v-if="store.selected" class="z-10 flex flex-col overflow-hidden bg-white" :class="{ 'md:hidden': !store.selected }">
			<header class="flex-shrink-0 p-4 bg-white border-b border-gray-200">
				<div class="space-y-3">
					<h1 id="message-subject" class="text-xl font-bold leading-tight text-gray-900 text-balance md:text-2xl">
						{{ store.selected.subject || "(Geen onderwerp)" }}
					</h1>

					<div class="flex flex-col gap-1 text-sm text-gray-600">
						<div class="flex items-center">
							<span class="min-w-0 mr-2 font-medium">Van:</span>
							<a :href="`mailto:${store.selected.from.address}`" class="text-[#1d4ed8] text-lg underline truncate hover:text-[#1e40af] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" :aria-label="`E-mail ${store.selected.from.address || 'Onbekende afzender'}`">
								{{ store.selected.from.address || "Onbekende afzender" }}
							</a>
						</div>
						<div class="flex items-center">
							<span class="min-w-0 mr-2 font-medium">Datum:</span>
							<NuxtTime :datetime="store.selected.date" weekday="long" year="numeric" month="short" day="2-digit" hour="2-digit" minute="2-digit" class="text-gray-700" />
						</div>

						<div class="flex items-center gap-2 mt-2">
							<button @click="store.backToList()" class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg md:hidden hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Terug naar berichtenlijst">
								<span>Overzicht</span>
							</button>

							<button @click="store.compose(store.selected)" class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Beantwoord dit bericht">
								<icon name="akar-icons:reply" class="w-4 h-4" aria-hidden="true" />
								<span>Beantwoorden</span>
							</button>
						</div>
					</div>
				</div>
			</header>

			<div class="flex-1 p-4 overflow-y-auto" aria-label="Bericht inhoud">
				<article class="prose text-gray-800 max-w-none">
					<div class="text-balance">
						<div v-html="store.selected.html" :class="store.selected.origin == 'email' ? 'space-y-4' : ''" class="text-balance viewer"></div>
					</div>
				</article>
			</div>
		</main>

		<div v-else class="z-10 items-center justify-center hidden rounded-lg md:flex bg-gray-50">
			<div class="max-w-sm text-center">
				<icon name="akar-icons:envelope" class="w-20 h-20 mx-auto mb-4 text-gray-300" aria-hidden="true" />
				<h2 class="mb-2 text-xl font-medium text-gray-700">Selecteer een bericht</h2>
				<p class="text-sm leading-relaxed text-gray-500">Om de volledige inhoud te bekijken</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: "authorized",
	});

	useSeoMeta({
		title: "Notificaties Dashboard",
		description: "Bekijk en beheer al je berichten, e-mails en notificaties op één plek.",
		ogTitle: "Notificaties Dashboard",
		ogDescription: "Bekijk en beheer al je berichten, e-mails en notificaties op één plek.",
		ogUrl: "/notifications",
		ogImage: "/icons/icon_512.png",
		twitterTitle: "Notificaties Dashboard",
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

	const { search } = useSearch();
	const { filter } = useFilter();

	const store = useNotifications();

	store.openMessageById((store.activeMessageId as string) || "");

	const filteredMessages = computed(() => {
		return store.filter(search.value as string, (filter.value || "all") as string);
	});
</script>
