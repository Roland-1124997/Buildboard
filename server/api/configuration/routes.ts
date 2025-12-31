

const createButton = (overrides: Buttons) => ({
    ...overrides,
    iconName: overrides.iconName || "akar-icons:edit",
});

const createFilter = (type: string, iconName: string, label: string, ariaLabel: string, color: string, large: boolean, alwaysShowLabel = true) => ({
    type, iconName, label, alwaysShowLabel, ariaLabel, color, large,
});

const createSearch = (context: string) => ({
    label: `Zoek in ${context}`,
    placeholder: `Zoek in ${context}...`,
});

const routes = cachedFunction((): Record<string, RouteType> => {

    return {
        "/": {
            label: "Statistieken",
            iconName: "akar-icons:statistic-up",
            toolbar: {
                stacked: false,
                groupWithFilters: true,
                fallbackFilter: 'vandaag',
                filters: [
                    createFilter("vandaag", "akar-icons:clock", "Vandaag", "Toon statistieken van vandaag", "neutral", false, false),
                    createFilter("week", "akar-icons:calendar", "Week", "Toon statistieken van deze week", "neutral", true, true),
                    createFilter("maand", "akar-icons:calendar", "Maand", "Toon statistieken van deze maand", "neutral", true, true),
                    createFilter("jaar", "akar-icons:calendar", "Jaar", "Toon statistieken van dit jaar", "neutral", true, true),
                ],
                // search: createSearch("statistieken"),
                store: 'useAnalytics',
            },
            
        },
        "/berichten": {
            label: "Berichten",
            iconName: "akar-icons:inbox",
            alert: true,
            toolbar: {
                stacked: true,
                groupWithFilters: true,
                fallbackFilter: 'all',
                buttons: [
                    createButton({
                        to: "/berichten/opstellen",
                        description: "Nieuw bericht schrijven",
                        isSmall: true,
                    }),
                ],
                filters: [
                    createFilter("all", "akar-icons:filter", "Alles", "Toon alle berichten", "neutral", false, false),
                    createFilter("gelezen", "akar-icons:open-envelope", "Gelezen", "Zoek gelezen berichten", "blue", true),
                    createFilter("ongelezen", "akar-icons:envelope", "Ongelezen", "Zoek ongelezen berichten", "red", true),
                ],
                search: createSearch("berichten"),
                store: 'useNotifications',
            },
            
        },
        "/artikelen": {
            label: "Artikelen",
            iconName: "akar-icons:newspaper",
            toolbar: {
                stacked: false,
                buttons: [
                    createButton({
                        to: "/artikelen/opstellen",
                        description: "Nieuw artikel schrijven",
                    }),
                ],
                search: createSearch("artikelen"),
                store: 'useArticles',
            },
        },
        "/opslagruimte": {
            label: "Opslagruimte",
            iconName: "akar-icons:folder",
            toolbar: {
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
                store: 'useStorage',
            },
        },
        "/account": {
            label: "Account",
            iconName: "akar-icons:person",
        },
        "/portfolio": {
            label: "Portfolio",
            iconName: "akar-icons:telescope",
        }
    }
}, {
    maxAge: 60 * 60,
    name: 'route-configuration',
});

export default defineSupabaseEventHandler( (event) => routes());