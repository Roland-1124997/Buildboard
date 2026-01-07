<template>
    <div>
        <div v-if="component == 'FormSelect'">
			<FormSelect :editor="props.editor" :content="props.repositories" />
		</div>

        <div v-else-if="component == 'FormInputUrl'">
            <FormInputUrl :props="props" />
        </div>

        <div v-else-if="component == 'Confirm'">
            <FormSelectChoices :props="props" />
        </div>

        <div v-else-if="component == 'Email'">
            <FormEmailPreview :props="props" />
        </div>
    </div>
</template>

<script lang="ts" setup>

    const { props, component } = defineProps<{
        props: Record<string, any>;
        component: string;
    }>();

</script>