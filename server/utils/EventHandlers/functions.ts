import type { H3Event } from "h3";
import { SupabaseClient, User } from "@supabase/supabase-js";

type SupaBaseUser = User & { current_session_id?: string, aal?: string };

export const defineSupabaseEventHandler = (callback: (event: H3Event, options: { client: SupabaseClient, user: SupaBaseUser, server: SupabaseClient }) => any) => {
    return defineEventHandler(async (event: H3Event) => {

        const client: SupabaseClient = await serverSupabaseClient(event);
        const server: SupabaseClient = serverSupabaseServiceRole(event)

        const { data: user, error } = await useSessionExists(event, client);
        if (!user || error) return useReturnResponse(event, unauthorizedError)

        if (user.factors && user.factors[0].status === 'verified') {

            if (user && user.aal != 'aal2') {
                return useReturnResponse(event, {
                    status: {
                        success: false,
                        redirect: "/auth/verify",
                        message: "MFA verification required",
                        code: 401
                    }
                })
            }

        }
        return callback(event, { client, user: user as SupaBaseUser, server })
    })
}

export const defineAuthEventHandler = (callback: (event: H3Event, options: { client: SupabaseClient, user: SupaBaseUser, server: SupabaseClient }) => any) => {
    return defineEventHandler(async (event: H3Event) => {

        const client: SupabaseClient = await serverSupabaseClient(event);
        const server: SupabaseClient = serverSupabaseServiceRole(event)

        const { data: user, error } = await useSessionExists(event, client);
        
        return callback(event, { client, user: user as SupaBaseUser, server })
    })
}


export const defineSupabaseFileHandler = (callback: (event: H3Event, options: { user: SupaBaseUser | null, server: SupabaseClient }) => any) => {
    return defineEventHandler(async (event: H3Event) => {

        const client: SupabaseClient = await serverSupabaseClient(event);
        const server: SupabaseClient = serverSupabaseServiceRole(event)

        const { data: user } = await useSessionExists(event, client);

        return callback(event, { user: user as SupaBaseUser, server })
    })
}
