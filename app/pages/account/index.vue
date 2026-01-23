<template>
	<div>
		<section class="relative grid grid-cols-1 gap-3 md:grid-cols-3">
			<article class="z-10 flex items-center w-full col-span-2 gap-2 p-2 border rounded-lg bg-gray-50 md:gap-3 md:p-3">
				<div class="flex items-center justify-center p-2 text-white bg-blue-600 rounded-lg shrink-0 md:p-3">
					<icon name="akar-icons:people-multiple" class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
				</div>
				<div class="flex-1 min-w-0">
					<h2 class="text-xs font-semibold text-gray-600 truncate md:text-sm">Gebruikersnaam</h2>
					<div class="flex items-center justify-between gap-2">
						<h3 class="text-base font-extrabold text-gray-900 truncate md:text-xl">
							{{ user?.email }}
						</h3>
					</div>
				</div>
			</article>

			<article class="z-10 flex items-center w-full gap-2 p-2 border rounded-lg bg-gray-50 md:gap-3 md:p-3">
				<div class="flex items-center justify-center p-2 text-white bg-blue-600 rounded-lg shrink-0 md:p-3">
					<icon name="akar-icons:shield" class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
				</div>
				<div class="flex-1 min-w-0">
					<h2 class="text-xs font-semibold text-gray-600 truncate md:text-sm">Tweefactorauthenticatie</h2>

					<div class="flex items-center justify-between gap-2">
						<button @click="deleteTotp" v-if="user?.factors.enabled" class="text-base font-extrabold text-gray-900 truncate md:text-xl">Ingeschakeld</button>
						<button @click="postTopt" v-else class="text-base font-extrabold text-gray-900 truncate md:text-xl">Uitgeschakeld</button>
					</div>
				</div>
			</article>
		</section>

		<section class="grid w-full grid-cols-1 mt-3 gap-y-3 md:gap-3 md:grid-cols-2 h-fit pb-[5.5rem] md:pb-0">
			<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-2">
				<div class="flex items-center justify-between mb-4">
					<div>
						<h2 class="text-xl font-bold text-gray-900">Actieve Sessies</h2>
						<p class="mt-1 text-sm text-gray-600">{{ sessions?.length || 0 }} actieve {{ sessions?.length === 1 ? "sessie" : "sessies" }}</p>
					</div>
				</div>

				<div v-if="sessions && sessions.length" class="space-y-3">
					<div v-for="(session, index) in sessions" :key="session.id" class="relative pt-5 bg-white border-t md:border md:p-5 md:rounded-xl">
						<div class="flex items-start justify-between mb-4">
							<div class="flex items-start gap-3">
								<div>
									<div class="flex items-center gap-2 mb-1">
										<h3 class="text-lg font-bold text-gray-900">
											{{ getLocationString(session) }}
										</h3>
									</div>

									<div class="flex flex-wrap items-center gap-2 select-none">
										<button v-if="!isCurrentSession(session.id)" @click="deleteSession(session.id)" class="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full outline-none focus:outline-none focus:ring-2 focus:ring-red-300" aria-label="Verwijder sessie">
											<icon name="akar-icons:circle-fill" class="w-2 h-2 mr-1.5" />
											Sessie verwijderen
										</button>
										<span v-if="isCurrentSession(session.id)" class="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
											<icon name="akar-icons:circle-fill" class="w-2 h-2 mr-1.5" />
											Huidige sessie
										</span>
										<span v-if="session.timezone" class="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
											<icon name="akar-icons:clock" class="w-3 h-3 mr-1" />
											{{ session.timezone }}
										</span>
										<span v-if="session.screen" class="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
											<icon name="akar-icons:devices" class="w-3 h-3 mr-1" />
											{{ deviceType(session.screen) }}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 md:grid-cols-3">
							<div class="flex items-start gap-3">
								<div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
									<icon name="akar-icons:network" class="w-4 h-4 text-blue-600" />
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">IP Adres</p>
									<p class="text-sm font-semibold text-gray-900">
										{{ session.ip_address || "Onbekend" }}
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
									<icon name="akar-icons:clock" class="w-4 h-4 text-blue-600" />
								</div>
								<div class="flex-1">
									<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Laatste activiteit</p>
									<p class="text-xs font-semibold text-gray-500 mt-0.5">
										<NuxtTime :datetime="session.updated_at" :relative="true" locale="nl-NL" />
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
									<icon name="akar-icons:door" class="w-4 h-4 text-blue-600" />
								</div>
								<div class="flex-1">
									<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Ingelogd op</p>
									<p class="text-xs font-semibold text-gray-500 mt-0.5">
										<NuxtTime :datetime="session.created_at" :relative="true" locale="nl-NL" />
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
									<icon name="akar-icons:location" class="w-4 h-4 text-blue-600" />
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Locatie</p>
									<p class="text-sm font-semibold text-gray-900">
										{{ getCounryName(session.country_code) }}
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
									<icon name="akar-icons:home-alt1" class="w-4 h-4 text-blue-600" />
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Regio</p>
									<p class="text-sm font-semibold text-gray-900">
										{{ getRegionName(session.region_code) }}
									</p>
								</div>
							</div>
						</div>

						<div class="flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 text-xs text-gray-500 border-t border-gray-200">
							<span class="flex items-center gap-1">
								<icon name="akar-icons:key" class="w-3.5 h-3.5" />
								<span class="font-mono">{{ session.id.substring(0, 8) }}...</span>
							</span>
						</div>
					</div>
				</div>

				<div v-else class="p-12 text-center text-gray-500">
					<div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
						<icon name="akar-icons:laptop-device" class="w-8 h-8 text-gray-400" />
					</div>
					<p class="text-lg font-medium">Geen actieve sessies gevonden</p>
					<p class="mt-1 text-sm">Log opnieuw in om een sessie te starten</p>
				</div>
			</article>
		</section>
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

	type Session = {
		id: string;
		created_at: string;
		updated_at: string;
		ip_address: string | null;
		continent_code: string | null;
		timezone: string | null;
		country_code: string | null;
		region_code: string | null;
		city: string | null;
		screen: string | null;
	};

	const store = useSessions();
	const user = ref();
	const sessions = ref<Session[]>([]);

	const failure = ref(false);

	const { data: userData } = await store.getSession();
	user.value = userData.data;

	const { data: sessionData, error, refresh } = await useFetch("/api/auth/account/sessions");

	if (error.value) failure.value = true;
	else if (sessionData.value) sessions.value = sessionData.value.data;

	watch(sessionData, (newData) => {
		if (newData) sessions.value = newData.data;
	});

	const request = useApiHandler<ApiResponse<Session[]>>("/api/auth/account/sessions");

	onMounted(async () => {
		if (failure.value) {
			const { data, error } = await request.Get();

			if (!error && data && data.data) {
				sessions.value = data.data;
				failure.value = false;
			}
		}
	});

	const current_active_session = computed(() => {
		return user.value?.session || "";
	});

	const { create, close } = useModal();
	const deleteSession = async (sessionId: string) => {

		const onComplete = async () => {
            close(); 
            await refresh();
        }

		const onCancel = () => close(); 
			
		create({
			name: "Sessie Verwijderen",
			description: "Weet je zeker dat je deze sessie wilt verwijderen? Hierdoor wordt de sessie onmiddellijk afgemeld.",
			component: "Confirm",
			props: {
				onCancel,
                onComplete,
                request: {
                    url: `/api/auth/account/sessions/${sessionId}`,
                    method: "DELETE",
                },
                message: {
                    success: "Sessie succesvol verwijderd.",
                    confirm: "Ja, verwijder sessie",
                    cancel: "Nee, behoud sessie",
                }
			},
		});
	};

	const isCurrentSession = (sessionId: string) => {
		return sessionId === current_active_session.value;
	};

	const getLocationString = (session: Session) => `${session.city}, ${session.country_code}`;

	const getCounryName = (countryCode: string | null) => {
		if (!countryCode) return "Onbekend";
		const regionNames = new Intl.DisplayNames(["nl"], { type: "region" });
		return regionNames.of(countryCode) || "Onbekend";
	};

	const getRegionName = (regionCode: string | null) => {
		if (!regionCode) return "Onbekend";

		const dutchProvinces: Record<string, string> = {
			DR: "Drenthe",
			FL: "Flevoland",
			FR: "Friesland",
			GE: "Gelderland",
			GR: "Groningen",
			LI: "Limburg",
			NB: "Noord-Brabant",
			NH: "Noord-Holland",
			OV: "Overijssel",
			UT: "Utrecht",
			ZE: "Zeeland",
			ZH: "Zuid-Holland",
		};

		return dutchProvinces[regionCode.toUpperCase()] || regionCode;
	};

	const deviceType = (screen: string) => {
		const width = parseInt(screen.split("x")[0] || "0");
		if (width <= 768) return "Mobiel";
		if (width <= 1024) return "Tablet";
		return "Desktop";
	};

	const resetFunction = async () => {
		const Request = useApiHandler<ApiResponse<Record<string, any>>>("/api/user");
		const { data, error } = await Request.Get();
		if (!error && data && data.data) {
			store.setSession(data.data, false);
			user.value = data.data;
		}
	};

	
	const postTopt = async () => {

		const Request = useApiHandler<ApiResponse<{ uri: string; secret: string; qr_code: string }>>("/api/auth/totp");
		const { data, error } = await Request.Post();
		if (error) return;
		
		const onComplete = async () => {
			close();
			await resetFunction();
		}

		const onClose = async () => {
			const { error } = await Request.Delete();
			if (!error) await resetFunction();
			close();
		}

		create({
			name: "Tweefactorauthenticatie Instellen",
			description: "Stel tweefactorauthenticatie in om je account beter te beveiligen.",
			component: "Totp",
			props: {
				content: data?.data,
				onComplete,
				onClose,
			},
		});
		await resetFunction();
	};

	const deleteTotp = async () => {
		
		const onComplete = async () => {
			close(); 
			await resetFunction();
		}

		const onCancel = () => close();
		
		create({
			name: "Tweefactorauthenticatie Uitschakelen",
			description: "Weet je zeker dat je tweefactorauthenticatie wilt uitschakelen? Dit vermindert de beveiliging van je account.",
			component: "Confirm",
			props: {
				onCancel,
				onComplete,
				request: {
					url: `/api/auth/totp`,
					method: "DELETE",
				},
				message: {
					success: "Tweefactorauthenticatie succesvol uitgeschakeld.",
					confirm: "Ja, schakel uit",
					cancel: "Nee, behoud",
				}
			},
		});
	};
</script>
