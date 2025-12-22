const routes = cachedFunction(() => {

    return [
        {
            to: "/",
            label: "Dashboard",
            iconName: "akar-icons:dashboard",
        },
        {
            to: "/notifications",
            label: "Notificaties",
            iconName: "akar-icons:inbox",
            alert: true,
        },
        {
            to: "/articles",
            label: "Artikelen",
            iconName: "akar-icons:newspaper",
        },
        {
            to: "/storage",
            label: "Storage",
            iconName: "akar-icons:folder",
        },
        {
            to: "/account",
            label: "Account",
            iconName: "akar-icons:person",
        },
        {
            to: "/portfolio",
            label: "Portfolio",
            iconName: "akar-icons:telescope",
        }
    ];

}, {
    maxAge: 60 * 60,
    name: 'sidebar-routes',
});

export default defineSupabaseEventHandler(async (event) => {
    return routes();
});