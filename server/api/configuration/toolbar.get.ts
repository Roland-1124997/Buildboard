const createButton = (overrides: Record<string, any>) => ({
	component: "UtilsButtonImportant",
	iconName: "akar-icons:edit",
	...overrides,
});

const createFilter = (type: string, iconName: string, label: string, ariaLabel: string, color: string, large: boolean, alwaysShowLabel = true) => ({
	component: "UtilsButtonFilter", type, iconName,
	label, alwaysShowLabel, ariaLabel, color, large,
});

const createSearch = (context: string) => ({
	label: `Zoek in ${context}`,
	placeholder: `Zoek ${context}...`,
});

const toolbar = cachedFunction(() => {

	return {
		"/notifications": {
			stacked: true,
			groupWithFilters: true,
			buttons: [
				createButton({
					to: "/compose",
					description: "Nieuw bericht schrijven",
					isSmall: true,
				}),
			],
			filters: [
				createFilter("all", "akar-icons:filter", "Alles", "Toon alle berichten", "neutral", false, false),
				createFilter("gelezen", "akar-icons:open-envelope", "Gelezen", "Zoek gelezen berichten", "blue", true),
				createFilter("ongelezen", "akar-icons:envelope", "Ongelezen", "Zoek ongelezen berichten", "red", true),
			],
			search: createSearch("artikelen"),
		},
		"/articles": {
			stacked: false,
			buttons: [
				createButton({
					to: "/articles/compose",
					description: "Nieuw artikel schrijven",
				}),
			],
			search: createSearch("artikelen"),
		},
		"/storage": {
			stacked: false,
			buttons: [
				createButton({
					iconName: "akar-icons:cloud-upload",
					description: "Bestanden uploaden",
					isButton: true,
					onClick: "triggerFileSelect",
				}),
				createButton({
					iconName: "akar-icons:arrow-right-left",
					description: "Bestanden synchroniseren",
					isButton: true,
					onClick: "refresh",
				}),
			],
			search: createSearch("bestanden"),
		},
	}
}, {
	maxAge: 60 * 60,
	name: 'toolbar-configuration',
});

export default defineSupabaseEventHandler(async (event) => {
	return toolbar();
});