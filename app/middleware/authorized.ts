
export default defineNuxtRouteMiddleware(async (to, from) => {

    const store = useSessions()

    const identity = Math.random().toString(36).substring(2) + Date.now().toString(36)

    const { data, error } = await useFetch('/api/user', {
        key: `user-session-${identity}`,
    })

    store.setSession(data.value, error.value)

    const isAuthPage = to.path.startsWith("/auth")

    if (isAuthPage && data.value) {
        if (to.path == from.path) return navigateTo("/")
        return navigateTo(from.path || "/")
    }

    if (!isAuthPage && !data.value) return navigateTo("/auth/login")
})