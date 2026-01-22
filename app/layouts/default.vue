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
	const session = useSessions();
	const storageStore = useStorage();
	const notifications = useNotifications();

	articles.initialPayload();
	storageStore.initialPayload();
	notifications.initialPayload();

	store.initialPayload();
	

	const { close } = await notifications.realTime();

	onMounted(async () => {
		
		session.setCloseFunction(close);

		if(articles.error) articles.refresh()
		if(storageStore.error) storageStore.refresh()
		if(notifications.error) notifications.refresh()

		if(store.error) store.refresh()
		

	});

	onUnmounted(() => close());

</script>

