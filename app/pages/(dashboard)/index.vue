<template>
	<div>
		<h1 class="hidden mb-6 text-2xl font-bold md:flex">Statistieken Overzicht</h1>

		<section class="relative grid grid-cols-2 gap-3 md:grid-cols-4">
			<ClientOnly>
				<UtilsAnalyticsQuickView :data="store.statistics" />
				<template #fallback>
					<UtilsAnalyticsSkeleton />
				</template>
			</ClientOnly>
		</section>

		<section class="grid w-full grid-cols-1 mt-3 gap-y-3 md:gap-3 md:grid-cols-3 h-fit pb-[5.5rem] md:pb-0">
			<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-2">
				<h2 class="mb-1 text-xl font-bold">Meest bezochte pagina's</h2>

				<ClientOnly v-if="store.metrics">
					<div class="md:hidden">
						<ChartsGroup :data="store.metrics.pages.values.slice(0, 3)" :categories="store.metrics.pages.categories" :height="250" :y_axis="['bezoekers', 'weergaven', 'bezoeken']" />
					</div>

					<div class="hidden md:block">
						<ChartsGroup :data="store.metrics.pages.values.slice(0, 7)" :categories="store.metrics.pages.categories" :height="410" :y_axis="['bezoekers', 'weergaven', 'bezoeken']" />
					</div>

					<template #fallback>
						<div aria-hidden class="flex flex-col gap-3 h-[248px] mt-10 md:h-[388px] animate-pulse">
							<div class="flex h-full gap-2">
								<div class="flex-1 bg-gray-200 rounded"></div>
								<div class="flex-1 bg-gray-200 rounded"></div>
								<div class="flex-1 bg-gray-200 rounded"></div>
								<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
								<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
							</div>
						</div>
					</template>
				</ClientOnly>

				<template v-else>
					<div aria-hidden class="flex flex-col gap-3 h-[248px] mt-10 md:h-[388px] animate-pulse">
						<div class="flex h-full gap-2">
							<div class="flex-1 bg-gray-200 rounded"></div>
							<div class="flex-1 bg-gray-200 rounded"></div>
							<div class="flex-1 bg-gray-200 rounded"></div>
							<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
							<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
						</div>
					</div>
				</template>
			</article>

			<article class="w-full col-span-1 p-6 bg-white border rounded-lg">
				<h2 class="mb-4 text-xl font-bold">Meest gebruikte apparaten</h2>

				<nav class="flex items-center w-full mb-3 overflow-x-auto border-b border-gray-200">
					<button type="button" @click="updateActiveDevice('bezoekers')" :class="[' text-left py-2 w-full text-sm font-medium transition-all whitespace-nowrap relative', activedDevice === 'bezoekers' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900']">
						Bezoekers
						<span v-if="activedDevice === 'bezoekers'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
					</button>
					<button type="button" @click="updateActiveDevice('bezoeken')" :class="['px-4 w-full py-2 text-sm font-medium transition-all whitespace-nowrap relative', activedDevice === 'bezoeken' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900']">
						Bezoeken
						<span v-if="activedDevice === 'bezoeken'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
					</button>
					<button type="button" @click="updateActiveDevice('weergaven')" :class="[' text-right w-full py-2 text-sm font-medium transition-all whitespace-nowrap relative', activedDevice === 'weergaven' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900']">
						Weergaven
						<span v-if="activedDevice === 'weergaven'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
					</button>
				</nav>

				<ClientOnly v-if="store.metrics">
					<ChartsDonut :active="activedDevice" :data="store.metrics.devices.values" :categories="store.metrics.devices.categories" :height="300" :arc-width="40" />
					<template #fallback>
						<div aria-hidden class="flex items-center justify-center mt-16 h-[300px]">
							<div class="relative w-[19rem] h-[19rem]">
								<div class="absolute inset-0 flex flex-col items-center justify-center gap-2">
									<div class="w-20 h-4 bg-gray-300 rounded-md"></div>
									<div class="w-10 h-4 bg-gray-200 rounded-md"></div>
								</div>
								<div class="absolute inset-0 border-[40px] border-gray-200 rounded-full"></div>
								<div class="absolute inset-0 border-[40px] rounded-full border-t-gray-300 animate-spin"></div>
							</div>
						</div>
					</template>
				</ClientOnly>

				<template v-else>
					<div aria-hidden class="flex items-center justify-center mt-16 h-[300px]">
						<div class="relative w-[19rem] h-[19rem]">
							<div class="absolute inset-0 flex flex-col items-center justify-center gap-2">
								<div class="w-20 h-4 bg-gray-300 rounded-md"></div>
								<div class="w-10 h-4 bg-gray-200 rounded-md"></div>
							</div>
							<div class="absolute inset-0 border-[40px] border-gray-200 rounded-full"></div>
							<div class="absolute inset-0 border-[40px] rounded-full border-t-gray-300 animate-spin"></div>
						</div>
					</div>
				</template>
			</article>

			<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-3">
				<h2 class="mb-1 text-xl font-bold">Breakdown per pagina</h2>
				<p class="mb-6 text-sm text-gray-600">Een overzicht van de belangrijkste statistieken per pagina,</p>

				<div class="grid gap-3 md:grid-cols-3">
					<ClientOnly v-if="store.metrics?.pages.values">
						<div v-for="page in store.metrics?.pages.values.slice(0, 6)" :key="page.label" class="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
							<div class="flex items-center pb-1 mb-2 text-sm font-semibold text-gray-900 truncate border-b">
								<p class="text-sm font-semibold text-gray-900">{{ page.label }}</p>
							</div>
							<div class="grid grid-cols-3 gap-2 text-center">
								<div>
									<h3 class="text-xs font-semibold text-blue-800">Bezoekers</h3>
									<p class="font-medium text-gray-900">{{ page.bezoekers }}</p>
								</div>

								<div>
									<h3 class="text-xs font-semibold text-blue-800">Bezoeken</h3>
									<p class="font-medium text-gray-900">{{ page.bezoeken }}</p>
								</div>
								<div>
									<h3 class="text-xs font-semibold text-blue-800">Weergaven</h3>
									<p class="font-medium text-gray-900">{{ page.weergaven }}</p>
								</div>
							</div>
						</div>

						<template #fallback>
							<div v-for="i in 6" :key="i" class="p-4 h-[6.6rem] animate-pulse bg-gray-100 border border-gray-200 rounded-lg">
								<div class="h-5 mb-3 bg-gray-200 rounded"></div>
								<div class="grid grid-cols-3 gap-2">
									<div class="h-4 bg-gray-200 rounded"></div>
									<div class="h-4 bg-gray-200 rounded"></div>
									<div class="h-4 bg-gray-200 rounded"></div>
								</div>
							</div>
						</template>
					</ClientOnly>

					<template v-else>
						<div v-for="i in 6" :key="i" class="p-4 h-[6.6rem] animate-pulse bg-gray-100 border border-gray-200 rounded-lg">
							<div class="h-5 mb-3 bg-gray-200 rounded"></div>
							<div class="grid grid-cols-3 gap-2">
								<div class="h-4 bg-gray-200 rounded"></div>
								<div class="h-4 bg-gray-200 rounded"></div>
								<div class="h-4 bg-gray-200 rounded"></div>
							</div>
						</div>
					</template>
				</div>
			</article>

			<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-2">
				<h2 class="mb-1 text-xl font-bold">Bezoekers per land</h2>
				<p class="mb-6 text-sm text-gray-600">Een visuele weergave van waar je bezoekers vandaan komen,</p>

				<ClientOnly v-if="store.metrics">
					<div class="pt-3 overflow-hidden">
						<div class="">
							<LazyChartsWorldmap :data="store.metrics.countries" :zoom-extent="[1.2, 45]" />
						</div>
					</div>

					<template #fallback>
						<div aria-hidden class="pt-3 animate-pulse">
							<div class="md:hidden h-[400px] bg-gray-200 rounded-lg"></div>
							<div class="hidden h-[520px] bg-gray-200 rounded-lg md:flex"></div>
						</div>
					</template>
				</ClientOnly>

				<template v-else>
					<div aria-hidden class="pt-3 animate-pulse">
						<div class="md:hidden h-[400px] bg-gray-200 rounded-lg"></div>
						<div class="hidden h-[520px] bg-gray-200 rounded-lg md:flex"></div>
					</div>
				</template>
			</article>

			<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-1">
				<h2 class="mb-1 text-xl font-bold">Top landen</h2>
				<p class="mb-6 text-sm text-gray-600">De landen waaruit je meeste bezoekers komen,</p>

				<div class="flex flex-col gap-3 pt-3">
					<ClientOnly v-if="store.metrics?.countries">
						<div v-for="country in store.metrics?.countries.slice(0, 4)" :key="country.name" class="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
							<div class="flex items-center pb-1 mb-2 border-b">
								<icon :name="`twemoji:flag-${useCounryName(country.name, 'en').replace(' ', '-').toLowerCase()}`" class="object-cover w-6 h-6 mr-2 rounded-sm" />
								<p class="text-sm font-semibold text-gray-900">{{ useCounryName(country.name) }}</p>
							</div>
							<div class="grid grid-cols-3 gap-2 text-center">
								<div>
									<h3 class="text-xs font-semibold text-blue-800">Bezoekers</h3>
									<p class="font-medium text-gray-900">{{ country.visitors }}</p>
								</div>

								<div>
									<h3 class="text-xs font-semibold text-blue-800">Bezoeken</h3>
									<p class="font-medium text-gray-900">{{ country.visits }}</p>
								</div>
								<div>
									<h3 class="text-xs font-semibold text-blue-800">Weergaven</h3>
									<p class="font-medium text-gray-900">{{ country.pageviews }}</p>
								</div>
							</div>
						</div>

						<template #fallback>
							<div v-for="i in 4" :key="i" class="p-4 h-[6.85rem] animate-pulse bg-gray-100 border border-gray-200 rounded-lg">
								<div class="h-5 mb-3 bg-gray-200 rounded"></div>
								<div class="grid grid-cols-3 gap-2">
									<div class="h-4 bg-gray-200 rounded"></div>
									<div class="h-4 bg-gray-200 rounded"></div>
									<div class="h-4 bg-gray-200 rounded"></div>
								</div>
							</div>
						</template>
					</ClientOnly>

					<template v-else>
						<div v-for="i in 4" :key="i" class="p-4 h-[6.85rem] animate-pulse bg-gray-100 border border-gray-200 rounded-lg">
							<div class="h-5 mb-3 bg-gray-200 rounded"></div>
							<div class="grid grid-cols-3 gap-2">
								<div class="h-4 bg-gray-200 rounded"></div>
								<div class="h-4 bg-gray-200 rounded"></div>
								<div class="h-4 bg-gray-200 rounded"></div>
							</div>
						</div>
					</template>
				</div>
			</article>
		</section>
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Analytics Dashboard",
		description: "Bekijk een overzicht van de algemene statistieken van je website, inclusief bezoekers, weergaven en bezoekduur.",
		ogTitle: "Analytics Dashboard",
		ogDescription: "Bekijk een overzicht van de algemene statistieken van je website, inclusief bezoekers, weergaven en bezoekduur.",
		ogUrl: "/",
		ogImage: "/icons/icon_512.png",
		twitterTitle: "Analytics Dashboard",
		twitterDescription: "Bekijk een overzicht van de algemene statistieken van je website, inclusief bezoekers, weergaven en bezoekduur.",
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
	const store = useAnalytics();

	const hidden = ref(true);

	const activedDevice = ref("bezoekers");
	const updateActiveDevice = (device: string) => {
		activedDevice.value = device;
	};
</script>
