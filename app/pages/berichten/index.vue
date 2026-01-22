<template>
	<div class="grid flex-1 grid-cols-1 overflow-hidden h-[77dvh] md:h-[74dvh] md:grid-cols-2">
		<div class="z-10 md:pr-4 md:border-r">
			<div class="flex-1 h-full overflow-y-auto">
				<div v-if="store.messages.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-gray-500 bg-white">
					<icon name="akar-icons:inbox" class="w-16 h-16 mb-4 text-gray-300" aria-hidden="true" />
					<h2 class="mb-2 text-lg font-medium">Geen berichten</h2>
					<p class="text-sm text-center">
						{{ displayMessage() }}
					</p>
				</div>

				<div v-if="store.pagination.total > 1" class="z-40 flex items-center gap-2 px-[0.15rem] pt-[0.15rem] pb-3">
					<div v-if="store.pagination.page - 1 != 0" class="flex items-center w-full gap-2">
						<button :disabled="store.loading" @click="store.toPage(1)" class="flex w-full items-center justify-center gap-2 px-3 py-[0.64rem] text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Beantwoord dit bericht">
							<icon name="akar-icons:chevron-left" class="w-4 h-4" aria-hidden="true" />
							<icon name="akar-icons:chevron-left" class="w-4 h-4 -ml-4" aria-hidden="true" />
							<span class="sr-only">Vorige pagina</span>
						</button>

						<button :disabled="store.loading" @click="store.previousPage" class="flex items-center justify-center w-full gap-2 px-5 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Beantwoord dit bericht">
							{{ store.pagination.page - 1 }}
						</button>
					</div>

					<div class="flex items-center justify-center w-full gap-2 px-5 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 border border-blue-500 rounded-lg hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
						<icon v-if="store.loading" name="akar-icons:arrow-cycle" class="w-4 h-4 py-[0.635rem] animate-spin" aria-hidden="true" />
						<p v-else> {{ store.pagination.page }} </p>
					</div>

					<div v-if="store.pagination.page + 1 <= store.pagination.total" class="flex items-center w-full gap-2">
						<button :disabled="store.loading" @click="store.nextPage" class="flex items-center justify-center w-full gap-2 px-5 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Beantwoord dit bericht">
							{{ store.pagination.page + 1 }}
						</button>

						<button :disabled="store.loading" @click="store.toPage(store.pagination.total)" class="flex w-full items-center justify-center gap-2 px-3 py-[0.64rem] text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Beantwoord dit bericht">
							<icon name="akar-icons:chevron-right" class="w-4 h-4 -mr-4" aria-hidden="true" />
							<icon name="akar-icons:chevron-right" class="w-4 h-4" aria-hidden="true" />

							<span class="sr-only">Volgende pagina</span>
						</button>
					</div>
				</div>

				<div type="button" v-for="inbox in store.messages" :key="inbox.id" @click="store.selectMessage(inbox)" @keydown.enter="store.selectMessage(inbox)" :class="['w-full md:p-4 p-3 px-4 text-left mb-2 border cursor-pointer transition-colors duration-150 rounded-lg', store.selected?.id == inbox.id ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 hover:bg-gray-100']">
					<div class="flex items-start gap-3 select-none">
						<div class="flex-1">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div v-if="!inbox.flags.includes('\\Seen')" class="flex-shrink-0 w-4 h-4 text-white bg-blue-500 rounded-full" role="status" aria-label="Ongelezen bericht"></div>
									<div v-if="store.messages.filter((message) => message.threadId === inbox.threadId).length > 1" class="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full" role="status" :aria-label="`${store.messages.filter((m) => m.threadId === inbox.threadId).length} berichten in deze conversatie`">
										<icon name="akar-icons:chat-dots" class="w-3 h-3" aria-hidden="true" />
										<span>{{ store.messages.filter((m) => m.threadId === inbox.threadId).length }}</span>
									</div>
									<h2 class="font-semibold text-gray-900 truncate text-balance">
										{{ inbox.from.name || "Onbekende afzender" }}
									</h2>
								</div>

								<div class="flex items-center gap-3">
									<p class="text-xs text-gray-600 truncate md:text-sm">
										<NuxtTime :datetime="inbox.date" year="2-digit" month="2-digit" day="2-digit" hour="2-digit" minute="2-digit" />
									</p>

									<div class="relative" @click.stop>
										<button @click="inbox.showDropdown = !inbox.showDropdown" class="flex items-center justify-center w-8 h-8 text-gray-600 transition-colors rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" :aria-label="`Meer acties voor bericht van ${inbox.from.name || 'Onbekende afzender'}`" :aria-expanded="inbox.showDropdown">
											<icon name="humbleicons:dots-horizontal" class="w-5 h-5" aria-hidden="true" />
										</button>

										<div v-if="inbox.showDropdown" class="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-52">
											<button
												v-if="inbox.flags.includes('\\Seen')"
												@click="
													store.markAsUnseen(inbox);
													inbox.showDropdown = false;
												"
												class="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
											>
												<icon name="akar-icons:envelope" size="1.25rem" aria-hidden="true" />
												<span>Markeer als ongelezen</span>
											</button>
											<button
												v-else
												@click="
													store.markAsSeen(inbox);
													inbox.showDropdown = false;
												"
												class="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
											>
												<icon name="akar-icons:open-envelope" size="1.25rem" aria-hidden="true" />
												<span>Markeer als gelezen</span>
											</button>
											<button
												@click="
													store.deleteMessage(inbox);
													inbox.showDropdown = false;
												"
												class="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-red-600 transition-colors border-t border-gray-200 hover:bg-red-50 focus:outline-none focus:bg-red-50"
											>
												<icon name="akar-icons:trash-can" size="1.25rem" aria-hidden="true" />
												<span>Prullenbak</span>
											</button>
										</div>
									</div>
								</div>
							</div>

							<p class="text-sm font-medium text-gray-600 text-balance line-clamp-2">
								{{ inbox.subject || "(Geen onderwerp)" }}
							</p>

							<p :class="store.selected?.id == inbox.id ? 'text-blue-950' : 'text-gray-700'" class="text-sm leading-relaxed line-clamp-2">
								{{ inbox.preview || "Geen preview beschikbaar" }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="store.selected" class="z-10 flex-col hidden overflow-hidden bg-white md:flex">
			<header class="flex-shrink-0 py-2 pb-3 bg-white border-b border-gray-200 md:p-4">
				<div class="z-40 items-center hidden gap-2 pb-3 border-b md:flex">
					<button @click="store.compose(store.selected)" class="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 border border-blue-500 rounded-lg w-fit hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Beantwoord dit bericht">
						<span>Beantwoorden</span>
					</button>
				</div>
				<div class="space-y-3 md:mt-2">
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
					</div>
				</div>
			</header>

			<div class="flex-1 py-2 overflow-y-auto md:p-4" aria-label="Bericht inhoud">
				<article class="prose text-gray-800 max-w-none">
					<div class="text-balance">
						<div v-html="store.selected.html" class="space-y-3 text-balance viewer"></div>
					</div>
				</article>
			</div>
		</div>

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

	const { search } = useSearch();
	const { filter } = useFilter();

	const displayMessage = () => {
		if (filter.value) {
			const seen = filter.value === "gelezen";
			const unseen = filter.value === "ongelezen";

			if (seen) return `Er zijn momenteel geen gelezen berichten`;
			else if (unseen) return `Er zijn momenteel geen ongelezen berichten`;
			else {
				if (search.value) return "Probeer een andere zoekterm";
				else return `Er zijn momenteel geen berichten`;
			}
		}

		return "Probeer een andere zoekterm";
	};

	const store = useNotifications();
	store.openMessageById((store.activeMessageId as string) || "");
</script>
