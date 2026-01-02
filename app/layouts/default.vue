<template>
	<UtilsNavigation>
		<main class="flex-1 p-4 overflow-y-auto ">
			<div class="mx-auto max-w-7xl">
				<slot></slot>
			</div>
		</main>
	</UtilsNavigation>
</template>

<script setup lang="ts">

	const store = useAnalytics();
	await store.initialPayload();

	useSearch();
	useFilter()
</script>

