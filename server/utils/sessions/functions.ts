
import type { H3Event } from "h3";
import { SupabaseClient, Session, AuthError, User } from "@supabase/supabase-js";

type SupaBaseUser = User & { current_session_id?: string };

export const useRefreshSession = async (client: SupabaseClient, currentSession: Session | Omit<Session, "user">) => await client.auth.refreshSession(currentSession);
export const useDeleteSession = async (client: SupabaseClient, user: SupaBaseUser) => await client.rpc("delete_sessions_by_id", { p_session_id: user.current_session_id})

export const useGetSession = async (client: SupabaseClient, currentSession: Session | Omit<Session, "user">) => {
    
    if(!currentSession?.access_token) return {
        data: { user: null }, 
        error: new AuthError('The user does not have an active session',)
    };

    const sesson_id = extractSessionId(currentSession)

    const { data, error } =  await client.auth.getUser(currentSession?.access_token);

    return { 
        data: {
            user: {
                ...data.user,
                current_session_id: sesson_id
            }
        },
        error
    }
}

export const useSetSessionData = async (event: H3Event, user: SupaBaseUser | null) => {
    if (user) {

        const client: SupabaseClient = await serverSupabaseClient(event);
        const hasMFA = !!(user.factors && user.factors[0].status === 'verified')

        if (hasMFA) {

            const { data } = await client.auth.mfa.getAuthenticatorAssuranceLevel();

            const needsVerification = hasMFA && data?.currentLevel !== 'aal2';
            if (needsVerification) return { mfa_needs_to_verified: true };
        }

        return {
            id: user.id,
            session: user.current_session_id,
            email: user.email,
            factors: {
                verified: hasMFA,
                enabled: !!user.factors,
            },
        };
    }

    return
}

export const useSessionExists = async (event: H3Event, client: SupabaseClient) => {

    const currentSession: any = await serverSupabaseSession(event);
    const { data, error } = await useGetSession(client, currentSession);

    return { data: data?.user, error };
}


const extractSessionId = (session: Omit<Session, "user">): string | undefined => {
    if (session?.access_token) {
        try {
            const sessionTokenParts = session.access_token.split('.');
            if (sessionTokenParts.length >= 2) {
                const token = JSON.parse(
                    Buffer.from(sessionTokenParts[1], 'base64').toString('ascii'),
                );
                return token.session_id;
            }
        } catch {
            return;
        }
    }
    return;
};