export default defineSupabaseEventHandler(async () => {
	return await $fetch("https://roland-meijer.nl/api/revalidate/articles", {})
		.then((data) => data)
		.catch((error) => error);
});
