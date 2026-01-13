import type { H3Event } from "h3";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export const defineSupabaseEventHandler = (callback: (event: H3Event, options: { client: SupabaseClient, user: User, server: SupabaseClient }) => any) => {
    return defineEventHandler(async (event: H3Event) => {

        const client: SupabaseClient = await serverSupabaseClient(event);
        const server: SupabaseClient = serverSupabaseServiceRole(event)

        const { data: user, error } = await useSessionExists(event, client);
        if (!user || error) return useReturnResponse(event, unauthorizedError)

        if(user.factors) {

            const { data } = await client.auth.mfa.getAuthenticatorAssuranceLevel()

            if(data && data.currentLevel != 'aal2') {
                return useReturnResponse(event, {
                    status: {
                        success: false,
                        redirect: "/auth/totp",
                        message: "MFA verification required",
                        code: 401
                    }
                })
            }

        }
        return callback(event, { client, user, server })
    })
}

export const defineSupabaseFileHandler = (callback: (event: H3Event, options: { user: User | null, server: SupabaseClient }) => any) => {
    return defineEventHandler(async (event: H3Event) => {

        const client: SupabaseClient = await serverSupabaseClient(event);
        const server: SupabaseClient = serverSupabaseServiceRole(event)

        const { data: user } = await useSessionExists(event, client);

        return callback(event, { user, server })
    })
}
