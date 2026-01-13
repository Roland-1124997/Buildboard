
import type { H3Event } from "h3";
import { SupabaseClient, Session, User, AuthError } from "@supabase/supabase-js";

export const useRefreshSession = async (client: SupabaseClient, currentSession: Session | Omit<Session, "user">) => await client.auth.refreshSession(currentSession);
export const useDeleteSession = async (client: SupabaseClient) => await client.auth.signOut();

export const useGetSession = async (client: SupabaseClient, currentSession: Session | Omit<Session, "user">) => {
    
    if(!currentSession?.access_token) return {
        data: { user: null }, 
        error: new AuthError('The user does not have an active session',)
    };

    return await client.auth.getUser(currentSession?.access_token);
}

export const useSetSessionData = async (event: H3Event, user: User | null) => {
    if (user) {

        const client: SupabaseClient = await serverSupabaseClient(event);
        const hasMFA = !!user.factors;

        if (hasMFA) {

            const { data } = await client.auth.mfa.getAuthenticatorAssuranceLevel();

            const needsVerification = hasMFA && data?.currentLevel !== 'aal2';
            if (needsVerification) return { mfa_needs_to_verified: true };
        }

        return {
            id: user.id,
            email: user.email,
            factors: hasMFA,
        };
    }

    return
}

export const useSessionExists = async (event: H3Event, client: SupabaseClient) => {

    const currentSession: any = await serverSupabaseSession(event);
    const { data, error } = await useGetSession(client, currentSession);

    return { data: data?.user, error };
}
