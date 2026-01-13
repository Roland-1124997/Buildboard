<template>
	<div class="relative z-10">
		<button v-if="user?.data?.data?.factors" @click="deleteData" class="px-4 py-2 ml-4 text-white bg-red-500 rounded">Verwijder TOTP Gegevens</button>

		<button v-else @click="postData" class="px-4 py-2 text-white bg-blue-500 rounded">Genereer TOTP Gegevens</button>

		<div>
			<div v-if="result" class="p-4 mt-6 border border-gray-200 rounded bg-gray-50">
				<h2 class="mb-4 text-lg font-medium text-gray-900">TOTP Informatie:</h2>
				<p><strong>Secret:</strong> {{ result.secret }}</p>
				<p class="mt-2">
					<strong>URI:</strong>
					<a :href="result.uri" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{{ result.uri }}</a>
				</p>

				<img v-if="result.qr_code" :src="result.qr_code" alt="QR Code" class="mt-4 border rounded" />

				<NuxtLink to="/auth/totp" class="inline-block px-4 py-2 mt-4 text-white bg-green-500 rounded"> Verifieer TOTP Code </NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: "authorized",
	});

	useSeoMeta({
		title: "Profiel Dashboard",
		description: "Bekijk en bewerk je profielinformatie.",
		ogTitle: "Profiel Dashboard",
		ogDescription: "Bekijk en bewerk je profielinformatie op Follio.",
		ogUrl: "/profile",
		ogImage: "/icons/icon_512.png",
		twitterTitle: "Profiel Dashboard",
		twitterDescription: "Bekijk en bewerk je profielinformatie op Follio.",
		twitterImage: "/icons/icon_512.png",
		twitterCard: "summary_large_image",
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

	const store = useSessions();
	const user = ref();

	user.value = await store.getSession();

	const uri = "/api/auth/totp";
	const Request = useApiHandler<ApiResponse<Record<string, any>>>(uri);
	const result = ref();

	const { addToast } = useToast();
	const UserRequest = useApiHandler<ApiResponse<null>>("/api/user");

	const postData = async () => {
		const { data, error } = await Request.Post();
		if (!error && data && data.data) {
			addToast({
				message: "TOTP gegevens succesvol gegenereerd.",
				type: "success",
			});

			result.value = data.data.totp;

			const { data: userData, error: userError } = await UserRequest.Get();
			if (!userError && userData && userData.data) {
				store.setSession(userData.data, false);
				user.value = await store.getSession();
			}
		} 
		
		else addToast({
			message: "Er is een fout opgetreden bij het genereren van TOTP gegevens.",
			type: "error",
		});
	};

	const deleteData = async () => {
		const { error } = await Request.Delete();

		if (!error) {
			addToast({
				message: "TOTP gegevens succesvol verwijderd.",
				type: "success",
			});

			const { data: userData, error: userError } = await UserRequest.Delete();
			if (!userError && userData && userData.data) {
				store.setSession(userData.data, false);
				user.value = await store.getSession();
			}
		} 
		
		else addToast({
			message: "Er is een fout opgetreden bij het verwijderen van TOTP gegevens.",
			type: "error",
		});
	};
</script>
