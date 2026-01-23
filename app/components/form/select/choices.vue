<template>
	<div class="w-full">
		<FormBase :schema="validationSchema" :request v-slot="{ loading, errors }">
			<div v-if="verified" class="p-4 border border-gray-200 rounded-lg bg-gray-50">
				<h2 class="mb-2 text-sm font-semibold text-gray-700">Bevestig deze actie</h2>
				<p class="mb-3 text-xs text-gray-600">Voer de 6-cijferige code in van je authenticator-app om deze actie te bevestigen.</p>

				<div class="mt-6">
					<UtilsInputTopt />
				</div>
			</div>

			<div class="flex flex-col gap-3 mt-9 sm:flex-row">
				<button type="submit" :disabled="loading" class="flex items-center justify-center flex-1 gap-2 px-5 py-3 text-sm font-medium text-white transition-colors duration-150 bg-red-600 border border-red-600 rounded-lg outline-none md:text-base focus:outline-none focus:ring-2 focus:ring-red-400 hover:bg-red-700" aria-label="Bevestigen">
					<icon name="akar-icons:check" class="w-4 h-4" aria-hidden="true" />
					<span> {{ props.message.confirm }} </span>
				</button>

				<button :disabled="loading" type="button" @click.stop="props.onCancel()" class="flex items-center justify-center flex-1 gap-2 px-5 py-3 text-sm font-medium text-gray-700 transition-colors duration-150 bg-white border border-gray-300 rounded-lg outline-none md:text-base focus:outline-none focus:ring-2 focus:ring-gray-400 hover:bg-gray-50 hover:border-gray-400" aria-label="Annuleren">
					<icon name="akar-icons:cross" class="w-4 h-4" aria-hidden="true" />
					<span> {{ props.message.cancel }} </span>
				</button>
			</div>
		</FormBase>
	</div>
</template>

<script lang="ts" setup>

	const session = useSessions();
	const verified = ref()

	const { data }= await session.getSession()

	verified.value = data.data.factors.verified

	const validationSchema = computed(() => {
		return verified.value ? schema.totp.frontend : schema.totp.optional.frontend
	}) as any

	const { props } = defineProps<{
		props: Record<string, any>;
	}>();

	const request: requestOptions = {
		url: props.request.url,
		method: props.request.method,
		successMessage: props.message.success,

		onsuccess: async () => {
			await props.onComplete();
		},

		onfailure: async (error, actions) => {
			const details = error.details as Record<string, string>;

			actions.setErrors(details);

			await new Promise((resolve) => setTimeout(resolve, 3000));
			actions.resetForm();
		},
	};
</script>
