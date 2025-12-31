<template>
	<div>
		<section v-if="store.statistics" class="relative grid grid-cols-2 gap-4 md:grid-cols-4">
			<article v-for="statistic in store.statistics" :key="statistic.label" class="z-10 w-full p-6 bg-white border rounded-lg">
				<h2 class="text-sm font-semibold text-gray-700">{{ statistic.label }}</h2>
				<h3 class="mt-4 text-2xl font-extrabold text-gray-900">{{ useFormatDuration(statistic.value, statistic.format) }}</h3>
				<p :title="`${useFormatDuration(statistic.difference, statistic.format)}`" class="mt-3">
					<span :class="statistic.positive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'" class="inline-flex items-center px-2 py-1 text-sm font-medium rounded">
						<span class="mr-2" aria-hidden="true">{{ statistic.positive ? "▲" : "▼" }}</span>
						{{ statistic.percentage }}
					</span>
				</p>
			</article>
		</section>
		<section v-else class="relative z-10 flex items-center justify-center w-full h-32 mt-4 bg-white border rounded-lg">
			<p class="text-gray-500">
				{{ store.error ? "Fout bij het laden van statistics." : "Laden van analytics..." }}
			</p>
		</section>

		<section class="relative pb-[5.5rem] mt-3 md:pb-0">
			<nav class="flex items-end justify-between py-2 pb-3 mb-3 border-y pr-[0.11rem]">
				<div>
					<h2 class="text-2xl font-bold">Pagina's</h2>
					<p class="text-gray-600 text-balance">Overzicht van de weergaven van je pagina's in de afgelopen periode.</p>
				</div>

				<button class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg w-fit hover:bg-blue-50 hover:text-blue-600 focus:text-blue-600 focus:border-blue-500 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="toggle table" @click="togleTable()">
					<icon :name="!isTableEnabled ? 'akar-icons:full-screen' : 'akar-icons:normal-screen'" class="w-4 h-4" aria-hidden="true" />
					<span class="sr-only">{{ isTableEnabled ? "Grafiekweergave" : "Tabelweergave" }}</span>
				</button>
			</nav>

			<article v-if="store.metrics.pages" class="w-full p-6 overflow-hidden z-10 bg-white border rounded-lg h-fit min-h-[16rem]">
				<div class="px-6 -mx-6 overflow-x-auto">
					<div v-if="store.metrics.pages.values.length <= 0" class="flex items-center justify-center min-h-[14rem]">
						<p class="text-center text-gray-500">Geen gegevens beschikbaar voor de geselecteerde periode.</p>
					</div>

					<ChartsTable v-else-if="isTableEnabled" title="Pagina's" :data="store.metrics.pages.values" :categories="store.metrics.pages.categories" />
					<client-only v-else>
						<div class="md:hidden">
							<ChartsGroup :data="store.metrics.pages.values.slice(0, 3)" :categories="store.metrics.pages.categories" :height="248" :y_axis="['bezoekers', 'weergaven', 'bezoeken']" />
						</div>

						<div class="hidden md:block">
							<ChartsGroup :data="store.metrics.pages.values" :categories="store.metrics.pages.categories" :height="350" :y_axis="['bezoekers', 'weergaven', 'bezoeken']" />
						</div>

						<template #fallback>
							<div class="flex text-center items-center justify-center min-h-[14rem]">
								<p class="text-gray-500">Laden van de grafiek...</p>
							</div>
						</template>
					</client-only>
				</div>
			</article>
			<article v-else class="relative z-10 flex items-center justify-center w-full h-32 bg-white border rounded-lg">
				<p class="text-gray-500">
					{{ store.error ? "Fout bij het laden van analytics." : "Laden van analytics..." }}
				</p>
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

	const { isTableEnabled, togleTable } = useTable();
	const store = useAnalytics();
	await store.initialPayload();

</script>
