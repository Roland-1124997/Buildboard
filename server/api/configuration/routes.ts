

const createButton = (overrides: Buttons) => ({
    ...overrides,
    iconName: overrides.iconName || "akar-icons:edit",
});

const createFilter = (type: string, iconName: string, label: string, ariaLabel: string, color: string, shortLabel: string, large: boolean, alwaysShowLabel = true) => ({
    type, iconName, label, alwaysShowLabel, ariaLabel, color, large, shortLabel: shortLabel,
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
                groupWithFilters: true,
                fallbackFilter: 'vandaag',
                filters: [
                    createFilter("vandaag", "akar-icons:clock", "Vandaag", "Toon statistieken van vandaag", "neutral", "Vandaag", false, false),
                    createFilter("week", "akar-icons:calendar", "Deze week", "Toon statistieken van deze week", "neutral", "Week", true, true),
                    createFilter("maand", "akar-icons:calendar", "Deze maand", "Toon statistieken van deze maand", "neutral", "Maand", true, true),
                    createFilter("jaar", "akar-icons:calendar", "Dit jaar", "Toon statistieken van dit jaar", "neutral", "Jaar",true, true),
                ],
                store: 'useAnalytics',
            },
            
        },
        "/berichten": {
            label: "Berichten",
            iconName: "akar-icons:inbox",
            alert: true,
            toolbar: {
                groupWithFilters: true,
                fallbackFilter: 'alles',
                buttons: [
                    createButton({
                        to: "/berichten/opstellen",
                        description: "Nieuw bericht schrijven",
                        isSmall: true,
                    }),
                ],
                filters: [
                    createFilter("alles", "akar-icons:filter", "Alles", "Toon alle berichten", "neutral", "Alles", false, false),
                    createFilter("gelezen", "akar-icons:open-envelope", "Gelezen", "Zoek gelezen berichten", "blue", "Gelezen", true),
                    createFilter("ongelezen", "akar-icons:envelope", "Ongelezen", "Zoek ongelezen berichten", "red","Ongelezen", true),
                ],
                search: createSearch("berichten"),
                store: 'useNotifications',
            },
            
        },
        "/artikelen": {
            label: "Artikelen",
            iconName: "akar-icons:newspaper",
            toolbar: {
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