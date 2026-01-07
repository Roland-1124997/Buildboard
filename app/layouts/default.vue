<template>
	<UtilsNavigation>
		<main class="flex-1 p-4 overflow-y-auto ">
			<div class="mx-auto">
				<slot></slot>
			</div>
		</main>
	</UtilsNavigation>
</template>

<script setup lang="ts">

	useSearch();
	useFilter()

	const store = useAnalytics();
	const articles = useArticles();
	const storageStore = useStorage();
	const notifications = useNotifications();

	await store.initialPayload();
	await articles.initialPayload();
	await storageStore.initialPayload();
	await notifications.initialPayload();
	
	const { close } = await notifications.realTime();

	onUnmounted(() => close());
	
</script>

