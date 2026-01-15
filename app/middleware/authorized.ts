
interface UserData {
    data?: {
        mfa_needs_to_verified?: boolean
        email: string
        factors: boolean
        id: string
    }
}

export default defineNuxtRouteMiddleware(async (to, from) => {

    const store = useSessions()

    const identity = Math.random().toString(36).substring(2) + Date.now().toString(36)

    const { data, error } = await useFetch<UserData>('/api/user', {
        key: `user-session-${identity}`,
    })


    store.setSession(data.value, error.value)

    const isAuthPage = to.path.startsWith("/auth")

    if (isAuthPage && data.value) {
        if (to.path == from.path) return navigateTo("/")
        return navigateTo(from.path || "/")
    }

    if (!isAuthPage && !data.value) return navigateTo("/auth/login")
    if (data.value?.data?.mfa_needs_to_verified) return navigateTo("/auth/verify")
})