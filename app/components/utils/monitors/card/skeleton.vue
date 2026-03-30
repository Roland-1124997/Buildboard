<template>
	<div class="pb-[5.5rem] md:pb-0">
		<div class="space-y-3">
			<div class="sticky top-0 z-20 flex items-center justify-between px-4 py-2 mb-3 border rounded-lg bg-blue-50 w-fit md:px-4 animate-pulse">
				<div class="w-24 h-5 bg-blue-200 rounded"></div>
			</div>

			<div class="space-y-3">
				<div class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg w-fit animate-pulse">
					<div class="w-4 h-4 bg-gray-200 rounded"></div>
					<div class="w-20 h-3 bg-gray-200 rounded"></div>
					<div class="w-3 h-3 bg-gray-100 rounded"></div>
					<div class="w-12 h-3 bg-gray-100 rounded"></div>
				</div>
				<div class="grid gap-3 md:grid-cols-2">
					<div v-for="i in 2" :key="'group1-' + i" class="w-full p-5 bg-white border border-gray-200 rounded-lg animate-pulse">
						<div class="flex items-start justify-between gap-2">
							<div class="flex-1">
								<div class="w-32 h-5 mt-1 mb-2 bg-gray-200 rounded"></div>
								<div class="w-48 h-3 mt-1 bg-gray-100 rounded"></div>
							</div>
							<div class="w-12 h-6 bg-gray-200 rounded-lg"></div>
						</div>
						<div class="grid grid-cols-2 gap-2 mt-4 text-sm">
							<div class="p-2 rounded-lg bg-gray-50">
								<div class="w-20 h-3 mb-2 bg-gray-200 rounded"></div>
								<div class="w-16 h-4 bg-gray-100 rounded"></div>
							</div>
							<div class="p-2 rounded-lg bg-gray-50">
								<div class="w-20 h-3 mb-2 bg-gray-200 rounded"></div>
								<div class="w-16 h-4 bg-gray-100 rounded"></div>
							</div>
							<div class="col-span-2 p-2 rounded-lg bg-gray-50">
								<div class="h-3 mb-2 bg-gray-200 rounded w-28"></div>
								<div class="w-40 h-4 bg-gray-100 rounded"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-3">
				<div class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg w-fit animate-pulse">
					<div class="w-4 h-4 bg-gray-200 rounded"></div>
					<div class="w-20 h-3 bg-gray-200 rounded"></div>
					<div class="w-3 h-3 bg-gray-100 rounded"></div>
					<div class="w-12 h-3 bg-gray-100 rounded"></div>
				</div>
				<div class="grid gap-3 md:grid-cols-2">
					<div v-for="i in 2" :key="'group2-' + i" class="w-full p-5 bg-white border border-gray-200 rounded-lg animate-pulse">
						<div class="flex items-start justify-between gap-2">
							<div class="flex-1">
								<div class="w-32 h-5 mt-1 mb-2 bg-gray-200 rounded"></div>
								<div class="w-48 h-3 mt-1 bg-gray-100 rounded"></div>
							</div>
							<div class="w-12 h-6 bg-gray-200 rounded-lg"></div>
						</div>
						<div class="grid grid-cols-2 gap-2 mt-4 text-sm">
							<div class="p-2 rounded-lg bg-gray-50">
								<div class="w-20 h-3 mb-2 bg-gray-200 rounded"></div>
								<div class="w-16 h-4 bg-gray-100 rounded"></div>
							</div>
							<div class="p-2 rounded-lg bg-gray-50">
								<div class="w-20 h-3 mb-2 bg-gray-200 rounded"></div>
								<div class="w-16 h-4 bg-gray-100 rounded"></div>
							</div>
							<div class="col-span-2 p-2 rounded-lg bg-gray-50">
								<div class="h-3 mb-2 bg-gray-200 rounded w-28"></div>
								<div class="w-40 h-4 bg-gray-100 rounded"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
