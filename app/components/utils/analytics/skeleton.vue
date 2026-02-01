<template>
	<article v-for="i in 4" :key="i" class="z-10 flex items-center w-full gap-2 p-2 bg-white border rounded-lg md:gap-3 md:p-3 animate-pulse">
		<div class="flex items-center justify-center p-2 bg-gray-200 rounded-lg shrink-0 md:p-3">
			<div class="w-5 h-5 bg-gray-300 rounded md:w-6 md:h-6"></div>
		</div>

		<div class="flex-1 min-w-0">
			<div class="w-20 h-3 mb-2 bg-gray-200 rounded"></div>
			<div class="flex items-center justify-between gap-2">
				<div class="w-16 h-5 bg-gray-300 rounded"></div>
				<div class="w-12 h-3 bg-gray-200 rounded"></div>
			</div>
		</div>
	</article>
</template>
