<template>
    <div :class="['grid gap-3', name === 'countries' ? 'md:grid-cols-1' : 'md:grid-cols-3']">
        <ClientOnly v-if="data.length >= 1">
            <UtilsAnalyticsCards :name :data="data.slice(0, visable)" />

            <template #fallback>
                <UtilsAnalyticsCardsSkeleton :name :count="visable" />
            </template>
        </ClientOnly>

        <template v-else>
            <UtilsAnalyticsCardsSkeleton :name :count="visable" />
        </template>
    </div>
</template>

<script setup lang="ts">

    defineProps<{
        visable: number
        data: any
        name: string
    }>()

</script>
