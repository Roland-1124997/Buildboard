<template>
	<div class="grid flex-1 grid-cols-1 h-[85dvh] overflow-hidden md:grid-cols-2">

		<h1 class="sr-only">Notificaties Dashboard</h1>
		
		
		<div class="z-10 md:pr-4 md:border-r" :class="{ 'hidden md:block': selected }">
			<nav class="sticky top-0 z-20 w-full p-1 pb-4 overflow-auto bg-white border-b border-gray-200">

				<UtilsInputSearch 
					name="search" label="Zoek in berichten"
					placeholder="Zoek berichten..." v-model="query"
				/>

				<div class="flex items-center gap-[0.35rem] mt-2">
					<UtilsButtonImportant
						to="/compose"
						icon-name="akar-icons:edit"
						description="Nieuw bericht schrijven"
						:isSmall="true"
					/>

					<button type="button" @click="setFilter('all')" :class="['flex items-center justify-center gap-2 px-4 py-[0.60rem] md:py-2 text-sm font-medium transition-colors duration-200 border rounded-lg outline-none w-fit focus:outline-none focus:ring-2', activeFilter === 'all' ? 'bg-neutral-100 text-neutral-800 border-neutral-400 focus:ring-neutral-400' : 'text-gray-700 bg-white border-gray-300 hover:bg-neutral-50 hover:text-neutral-600 focus:text-neutral-600 focus:border-neutral-500 hover:border-neutral-500 focus:ring-neutral-400']" aria-label="Toon alle berichten">
						<icon name="akar-icons:filter" class="w-4 h-4" aria-hidden="true" />
						<span class="hidden md:flex">Alles</span>
					</button>

					<button type="button" @click="setFilter('gelezen')" :class="['flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 border rounded-lg outline-none focus:outline-none focus:ring-2', activeFilter === 'gelezen' ? 'bg-blue-100 text-blue-800 border-blue-400 focus:ring-blue-300' : 'text-gray-700 bg-white border-gray-300 hover:bg-blue-50 hover:text-blue-600 focus:text-blue-600 focus:border-blue-500 hover:border-blue-500 focus:ring-blue-300']" aria-label="Zoek gelezen berichten">
						<icon name="akar-icons:open-envelope" class="w-4 h-4" aria-hidden="true" />
						<span>
							Gelezen
						</span>
					</button>

					<button type="button" @click="setFilter('ongelezen')" :class="['flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 border rounded-lg outline-none focus:outline-none focus:ring-2', activeFilter === 'ongelezen' ? 'bg-red-100 text-red-800 border-red-400 focus:ring-red-300' : 'text-gray-700 bg-white border-gray-300 hover:bg-red-50 focus:text-red-600 hover:text-red-600 focus:border-red-500 hover:border-red-500 focus:ring-red-300']" :aria-pressed="activeFilter === 'ongelezen'" aria-label="Zoek ongelezen berichten">
						<icon name="akar-icons:envelope" class="w-4 h-4" aria-hidden="true" />
						<span>
							Ongelezen
						</span>
					</button>
				</div>
			</nav>
			<div class="flex-1 h-[68dvh] overflow-y-auto">
				<div v-if="filteredMessages.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-gray-500 bg-white">
					<icon name="akar-icons:inbox" class="w-16 h-16 mb-4 text-gray-300" aria-hidden="true" />
					<h3 class="mb-2 text-lg font-medium">Geen berichten</h3>
					<p class="text-sm text-center">
						{{ query ? "Probeer een andere zoekterm" : "Er zijn momenteel geen notificaties" }}
					</p>
				</div>
				<div type="button" v-for="inbox in filteredMessages" :key="inbox.key" @click="selectMessage(inbox)" @keydown.enter="selectMessage(inbox)" :class="['w-full p-4 text-left cursor-pointer transition-all duration-150 border-b border-b-gray-200 bg-white', selected?.uid === inbox.uid ? 'bg-gray-50' : 'hover:bg-gray-100']">
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
								<button type="button" v-if="inbox.flags.includes('\\Seen')" @click.stop="markAsUnseen(inbox)" class="flex items-center justify-center gap-2 px-2 py-1 text-xs text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Markeer dit bericht als ongelezen">
									<icon name="material-symbols:mark-email-unread-outline-rounded" size="1rem" aria-hidden="true" />
									<span>Markeer als ongelezen</span>
								</button>
								<button type="button" v-else @click.stop="markAsSeen(inbox)" class="flex items-center justify-center gap-2 px-2 py-1 text-xs text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Markeer dit bericht als gelezen">
									<icon name="material-symbols:mark-email-read-outline-rounded" size="1rem" aria-hidden="true" />
									<span>Markeer als gelezen</span>
								</button>
								<button type="button" @click.stop="deleteMessage(inbox)" class="flex items-center justify-center gap-2 px-2 py-1 text-xs text-red-600 transition-colors duration-200 border border-red-300 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500" aria-label="Verplaats dit bericht naar prullenbak">
									<icon name="material-symbols:delete-outline-rounded" size="1rem" aria-hidden="true" />
									<span>Prullenbak</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<main v-if="selected" class="z-10 flex flex-col overflow-hidden bg-white" :class="{ 'md:hidden': !selected }">
			<header class="flex-shrink-0 p-4 bg-white border-b border-gray-200">
				<div class="space-y-3">
					<h1 id="message-subject" class="text-xl font-bold leading-tight text-gray-900 text-balance md:text-2xl">
						{{ selected.subject || "(Geen onderwerp)" }}
					</h1>

					<div class="flex flex-col gap-1 text-sm text-gray-600">
						<div class="flex items-center">
							<span class="min-w-0 mr-2 font-medium">Van:</span>
							<a :href="`mailto:${selected.from.address}`" class="text-[#1d4ed8] text-lg underline truncate hover:text-[#1e40af] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" :aria-label="`E-mail ${selected.from.address || 'Onbekende afzender'}`">
								{{ selected.from.address || "Onbekende afzender" }}
							</a>
						</div>
						<div class="flex items-center">
							<span class="min-w-0 mr-2 font-medium">Datum:</span>
							<NuxtTime :datetime="selected.date" weekday="long" year="numeric" month="short" day="2-digit" hour="2-digit" minute="2-digit" class="text-gray-700" />
						</div>

						<div class="flex items-center gap-2 mt-2">
							<button @click="backToList" class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg md:hidden hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Terug naar berichtenlijst">
								<span>Overzicht</span>
							</button>

							<button @click="compose(selected)" class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Beantwoord dit bericht">
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
						<div v-html="selected.html" :class="selected.origin == 'email' ? 'space-y-4' : ''" class="text-balance viewer"></div>
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

	const notificationsStore = useNotificationsStore();
	const { markAsSeen, markAsUnseen, deleteMessage, savePayload, refresh } = notificationsStore;

	const route = useRoute();
	const router = useRouter();
	const messages = computed(() => ({ data: { messages: notificationsStore.messages } }));

	// ***************************************************************************

	const compose = async (payload: Record<string, any>) => {
		await savePayload(payload);

		router.push({
			path: "/compose",
			query: {
				reply: "true",
			},
		});
	};

	const query = ref((route.query.search) || "");

	const selected = ref<any | null>(null);

	const selectMessage = async (message: any) => {
		selected.value = message;

		router.push({
			query: {
				...router.currentRoute.value.query,
				id: message.id,
			},
		});

		markAsSeen(message);
	};

	const backToList = () => {
		selected.value = null;

		router.push({
			query: {
				...router.currentRoute.value.query,
				id: undefined,
			},
		});
	};

	// ***************************************************************************

	const activeFilter = ref(route.query.filter || "all");

	const setFilter = async (filterType: string) => {
		activeFilter.value = filterType;

		router.push({
			query: {
				...router.currentRoute.value.query,
				filter: filterType,
			},
		});

		await refresh();
	};

	const activeMessageId = computed(() => route.query.id);

	if (activeMessageId.value) {
		const messageToOpen = messages.value.data.messages.find((msg: any) => {
			return msg.id === activeMessageId.value;
		});

		if (messageToOpen) {
			selectMessage(messageToOpen);
		}
	}

	const filteredMessages = computed(() => {
		let filtered = messages.value.data.messages;

		filtered = filtered.filter((message: any) => {

			const flags = message.flags || [];

			if (activeFilter.value === "all") return true;
			if (activeFilter.value === "gelezen") return flags.includes('\\Seen');
			else if (activeFilter.value === "ongelezen") return !flags.includes('\\Seen');
			
		});

		router.replace({ query: { 
			...route.query, 
			filter: activeFilter.value 
		}});

		if (query.value) {
			filtered = filtered.filter((message: any) => {
				const subject = message.subject || "";
				const from = message.from?.address || message.from?.name || "";
				const preview = message.preview || message.text || "";

				return (
					subject.toLowerCase().includes((query.value as string).toLowerCase()) ||
					from.toLowerCase().includes((query.value as string).toLowerCase()) ||
					preview.toLowerCase().includes((query.value as string).toLowerCase())
				);
			});
		}

		return filtered;
	});
</script>
