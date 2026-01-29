<template>
	<div class="fixed top-0 left-0 flex w-full h-screen">
		<UtilsDotPattern class="opacity-60" :width="20" :height="20" :cx="1" :cy="1" :cr="1" />

		<div class="relative z-10 flex flex-col w-full gap-6 p-12 px-6 sm:px-12 lg:px-16 xl:px-24">
			<div>
				<div class="flex items-center space-x-3">
					<div class="flex items-center justify-center w-12 h-12 bg-black rounded-xl">
						<Icon name="akar-icons:briefcase" class="text-white w-7 h-7" />
					</div>
					<span class="text-2xl font-bold">Dashboard</span>
				</div>
			</div>

			<main class="space-y-6 md:mt-10">
				<div v-if="error" class="py-8 font-extrabold leading-none text-white bg-black px-11 text-9xl w-fit rounded-xl">{{ error.status }}</div>
				<div v-else class="font-extrabold leading-none text-9xl text-black/50">...</div>

				<h1 v-if="error" class="text-4xl font-bold leading-tight xl:text-5xl">Oeps! Er is een fout opgetreden.</h1>
				<h1 v-else class="text-4xl font-bold leading-tight xl:text-5xl">Je wordt zo teruggeleid...</h1>

				<p v-if="error" class="max-w-xl text-lg">Er is een probleem opgetreden bij het laden van de pagina. Probeer het later opnieuw</p>
				<p v-else class="max-w-xl text-lg">Je wordt automatisch teruggeleid naar de startpagina. Dit kan een paar seconden duren.</p>

				<DevOnly>
					{{ error?.stack }}
				</DevOnly>
				
				<div v-if="error" class="relative w-full">
					<button @click="handleError" class="relative inline-flex md:min-w-[20rem] items-center justify-center w-full gap-2 px-4 py-3 text-white transition bg-black md:w-fit hover:bg-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:opacity-60">
						<span class="inline-flex items-center gap-2">
							<Icon name="akar-icons:arrow-left" />
							Terug naar home
						</span>
					</button>
				</div>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
	const error = useError();

	const handleError = () => {
		return clearError({ redirect: "/" });
	};
</script>
