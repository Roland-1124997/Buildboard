<template>
	<div v-for="n in 2" :key="n" class="relative z-10 flex flex-col h-full p-0 overflow-hidden transition-all duration-200 bg-white border border-gray-200 shadow-sm md:hidden rounded-2xl animate-pulse">
		<div class="flex flex-col flex-1 gap-3 p-5 pt-2">
			<div class="flex items-center justify-between gap-2 mt-3">
				<div class="w-2/4 h-6 bg-gray-200 rounded"></div>
				<div class="flex items-center gap-2">
					<div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
					<div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
					<div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
				</div>
			</div>
			<div class="w-full h-4 mb-2 bg-gray-200 rounded"></div>
			<div class="w-2/3 h-4 mb-2 bg-gray-200 rounded"></div>
			<div class="w-full h-40 mb-2 bg-gray-200 rounded-lg"></div>
			<div class="flex flex-wrap items-center gap-2 mb-2 select-none">
				<div v-for="i in 3" :key="i" class="w-16 h-5 bg-gray-200 rounded-md"></div>
			</div>
			<div class="flex flex-wrap items-center gap-2 mt-auto text-xs select-none">
				<div class="w-24 h-5 bg-gray-200 rounded-lg"></div>
				<div class="w-16 h-5 bg-gray-200 rounded-lg"></div>
				<div class="w-32 h-5 bg-gray-200 rounded-lg"></div>
			</div>
		</div>
	</div>
	<div v-for="n in 6" :key="n" class="relative z-10 flex-col hidden h-full p-0 overflow-hidden transition-all duration-200 bg-white border border-gray-200 shadow-sm md:flex rounded-2xl animate-pulse">
		<div class="flex flex-col flex-1 gap-3 p-5 pt-2">
			<div class="flex items-center justify-between gap-2 mt-3">
				<div class="w-2/4 h-6 bg-gray-200 rounded"></div>
				<div class="flex items-center gap-2">
					<div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
					<div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
					<div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
				</div>
			</div>
			<div class="w-full h-4 mb-2 bg-gray-200 rounded"></div>
			<div class="w-2/3 h-4 mb-2 bg-gray-200 rounded"></div>
			<div class="w-full h-40 mb-2 bg-gray-200 rounded-lg"></div>
			<div class="flex flex-wrap items-center gap-2 mb-2 select-none">
				<div v-for="i in 3" :key="i" class="w-16 h-5 bg-gray-200 rounded-md"></div>
			</div>
			<div class="flex flex-wrap items-center gap-2 mt-auto text-xs select-none">
				<div class="w-24 h-5 bg-gray-200 rounded-lg"></div>
				<div class="w-16 h-5 bg-gray-200 rounded-lg"></div>
				<div class="w-32 h-5 bg-gray-200 rounded-lg"></div>
			</div>
		</div>
	</div>
</template>
