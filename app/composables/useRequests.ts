
const catcher = async <T>(promise: Promise<T>) => {

    try {
        const data = await promise;
        return { data, error: null };
    }

    catch (error: any) {
        return { data: null, error: (error.data.error || error.data || error) as ErrorResponse };
    }
}

export const useCsrfToken = async () => {
    await catcher<ApiResponse<{ csrfToken: string }>>($fetch("/api/security/csrf-token"));
}

export const useApiHandler = <G>(url: FetchUrl) => {

    const Send = async <T = G>(options?: SendOptions): Promise<{ data: T | null; error: ErrorResponse | null }> => {
        
        if(options?.method != 'GET') await useCsrfToken();

        const extendedUrl = options?.extends ? `${url}${options.extends}` : url;
        return catcher<T>($fetch(extendedUrl, {
            ...options
        }))
    }

    const Get = <T = G>(options?: MethodOptions) => Send<T>({
        ...options, method: 'GET'
    })

    const Post = async <T = G>(options?: MethodOptions) => Send<T>({
        ...options, method: 'POST'
    })

    const Delete = async <T = G>(options?: MethodOptions) => Send<T>({
        ...options, method: 'DELETE'
    })

    const Patch = async <T = G>(options?: MethodOptions) => Send<T>({
        ...options, method: 'PATCH'
    })

    return {
        Send, Get, Post, Delete, Patch
    }
}