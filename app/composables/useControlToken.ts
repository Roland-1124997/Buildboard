export const useControlToken = () => {

    const config = useRuntimeConfig()
    const { securityKey } = config.public

    const token = ref()

    if (import.meta.server) 
        token.value = useNuxtApp().ssrContext?.event?.context?.controlToken

    else {
        const metaTag = window.document.querySelector(`meta[name="${securityKey}"]`)
        token.value = metaTag?.getAttribute('content')
    }

    return token.value as string | undefined
        
}

