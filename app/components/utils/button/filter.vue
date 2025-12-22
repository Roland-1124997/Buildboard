<template>
   
	<button 
		type="button" 
		@click="callback(type)" 
		:class="[
			'flex items-center justify-center gap-2 px-4 text-sm font-medium transition-colors duration-200 border rounded-lg outline-none focus:outline-none focus:ring-2',
			large ? 'py-2 w-full' : 'py-[0.68rem] w-fit md:py-2',
			getColorClasses(color, filter === type)
		]"
		:aria-pressed="filter === type"
	>
		<Icon :name="iconName" class="w-4 h-4" aria-hidden="true" />
		<span :class="alwaysShowLabel ? 'flex' : 'hidden md:flex'">{{ label }}</span>
	</button>
</template>

<script setup lang="ts">
	const { filter } = useFilter();

	defineProps({
		type: {
			type: String,
			required: true,
		},
		callback: {
			type: Function,
			required: true,
		},
		iconName: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		alwaysShowLabel: {
			type: Boolean,
			required: true,
		},
		color: {
			type: String,
			required: false,
			default: "neutral",
		},
		large: {
			type: Boolean,
			required: false,
			default: false,
		},
	});

	const getColorClasses = (color: string, isActive: boolean) => {
		const colors: Record<string, { active: string; inactive: string }> = {
			neutral: {
				active: 'bg-neutral-100 text-neutral-800 border-neutral-400 focus:ring-neutral-400',
				inactive: 'text-gray-700 bg-white border-gray-300 hover:bg-neutral-50 hover:text-neutral-600 focus:text-neutral-600 focus:border-neutral-500 hover:border-neutral-500 focus:ring-neutral-400'
			},
			blue: {
				active: 'bg-blue-100 text-blue-800 border-blue-400 focus:ring-blue-300',
				inactive: 'text-gray-700 bg-white border-gray-300 hover:bg-blue-50 hover:text-blue-600 focus:text-blue-600 focus:border-blue-500 hover:border-blue-500 focus:ring-blue-300'
			},
			red: {
				active: 'bg-red-100 text-red-800 border-red-400 focus:ring-red-300',
				inactive: 'text-gray-700 bg-white border-gray-300 hover:bg-red-50 hover:text-red-600 focus:text-red-600 focus:border-red-500 hover:border-red-500 focus:ring-red-300'
			}
		};

		return isActive ? colors[color]?.active : colors[color]?.inactive;
	};
</script>

<!-- <button type="button" @click="callback('all')" :class="['flex items-center justify-center gap-2 px-4 py-[0.60rem] md:py-2 text-sm font-medium transition-colors duration-200 border rounded-lg outline-none w-fit focus:outline-none focus:ring-2', filter === 'all' ? 'bg-neutral-100 text-neutral-800 border-neutral-400 focus:ring-neutral-400' : 'text-gray-700 bg-white border-gray-300 hover:bg-neutral-50 hover:text-neutral-600 focus:text-neutral-600 focus:border-neutral-500 hover:border-neutral-500 focus:ring-neutral-400']" aria-label="Toon alle berichten">
						<icon name="akar-icons:filter" class="w-4 h-4" aria-hidden="true" />
						<span class="hidden md:flex">Alles</span>
					</button>

					<button type="button" @click="callback('gelezen')" :class="['flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 border rounded-lg outline-none focus:outline-none focus:ring-2', filter === 'gelezen' ? 'bg-blue-100 text-blue-800 border-blue-400 focus:ring-blue-300' : 'text-gray-700 bg-white border-gray-300 hover:bg-blue-50 hover:text-blue-600 focus:text-blue-600 focus:border-blue-500 hover:border-blue-500 focus:ring-blue-300']" aria-label="Zoek gelezen berichten">
						<icon name="akar-icons:open-envelope" class="w-4 h-4" aria-hidden="true" />
						<span> Gelezen </span>
					</button>

					<button type="button" @click="callback('ongelezen')" :class="['flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 border rounded-lg outline-none focus:outline-none focus:ring-2', filter === 'ongelezen' ? 'bg-red-100 text-red-800 border-red-400 focus:ring-red-300' : 'text-gray-700 bg-white border-gray-300 hover:bg-red-50 focus:text-red-600 hover:text-red-600 focus:border-red-500 hover:border-red-500 focus:ring-red-300']" :aria-pressed="filter === 'ongelezen'" aria-label="Zoek ongelezen berichten">
						<icon name="akar-icons:envelope" class="w-4 h-4" aria-hidden="true" />
						<span> Ongelezen </span>
                    </button> -->