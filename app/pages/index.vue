<template>
	<div>
		<h1 class="hidden mb-6 text-2xl font-bold md:flex">Statistieken Overzicht</h1>

		<section class="relative grid grid-cols-2 gap-3 md:grid-cols-4">
			<UtilsAnalyticsQuickView :data="store.statistics" />
		</section>

		<section class="grid w-full grid-cols-1 mt-3 gap-y-3 md:gap-3 md:grid-cols-3 h-fit pb-[5.5rem] md:pb-0">
			<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-2">
				<h2 class="mb-1 text-xl font-bold">Meest bezochte pagina's</h2>

				<ClientOnly>
					<div class="md:hidden">
						<ChartsGroup :data="store.metrics.pages.values.slice(0, 3)" :categories="store.metrics.pages.categories" :height="250" :y_axis="['bezoekers', 'weergaven', 'bezoeken']" />
					</div>

					<div class="hidden md:block">
						<ChartsGroup :data="store.metrics.pages.values.slice(0, 5)" :categories="store.metrics.pages.categories" :height="410" :y_axis="['bezoekers', 'weergaven', 'bezoeken']" />
					</div>

					<template #fallback>
						<div aria-hidden class="flex text-center items-center justify-center h-[268px] md:h-[428px]"></div>
					</template>
				</ClientOnly>
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

				<ClientOnly>
					<ChartsDonut :active="activedDevice" :data="store.metrics.devices.values" :categories="store.metrics.devices.categories" :height="300" :arc-width="40" />
					<template #fallback>
						<div aria-hidden class="flex text-center items-center justify-center h-[300px] md:h-[300px]"></div>
					</template>
				</ClientOnly>
			</article>

			<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-3">
				<h2 class="mb-1 text-xl font-bold">Algemene breakdown</h2>
				<p class="mb-6 text-sm text-gray-600">Een overzicht van de belangrijkste statistieken per pagina.</p>

				<ChartsCards :data="store.metrics.pages.values" :categories="store.metrics.pages.categories" />
			</article>
		</section>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: "authorized",
	});

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

	const activedDevice = ref("bezoekers");

	const updateActiveDevice = (device: string) => {
		activedDevice.value = device;
	};

	const store = useAnalytics();
</script>
