<template>
    <div class="fixed top-0 left-0 flex w-full h-screen overflow-hidden">
        <slot></slot>
        <UtilsToast />
		<div class="fixed z-[100] w-screen h-screen pointer-events-none">
			<div class="pointer-events-auto">
				<Modal />
			</div>
		</div>
    </div>
</template>