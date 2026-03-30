<template>
	<div class="w-full p-2">
		<div class="flex items-start justify-between gap-2">
			<div>
				<h2 class="text-base font-semibold text-gray-900 capitalize">
					{{ monitor.attributes.pronounceable_name }}
				</h2>
				<p class="mt-1 text-xs text-blue-700 break-all">
					{{ monitor.attributes.url }}
				</p>
			</div>

			<span class="px-2 py-1 text-xs font-semibold rounded-lg" :class="monitor.attributes.status === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
				{{ monitor.attributes.status }}
			</span>
		</div>

		<dl class="grid grid-cols-2 gap-2 mt-4 text-sm">
			<div class="p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 hover:bg-gray-100">
				<dt class="text-xs text-gray-700">Check frequentie</dt>
				<dd class="font-medium text-gray-900">{{ monitor.attributes.check_frequency }}s</dd>
			</div>

			<div class="p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 hover:bg-gray-100">
				<dt class="text-xs text-gray-700">HTTP method</dt>
				<dd class="font-medium text-gray-900 uppercase">{{ monitor.attributes.http_method }}</dd>
			</div>

			<div class="col-span-2 p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 hover:bg-gray-100">
				<dt class="text-xs text-gray-700">Laatst gecontroleerd</dt>
				<dd class="font-medium text-gray-900">
					<NuxtTime locale="nl" year="numeric" month="short" day="2-digit" hour="2-digit" minute="2-digit" :datetime="monitor.attributes.last_checked_at" />
				</dd>
			</div>
		</dl>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		monitor: {
			type: Object,
			required: true,
		},
	});
</script>
