import { User } from "@supabase/supabase-js";
type SupaBaseUser = User & { current_session_id?: string, aal?: string };

export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event);
    const currentSession = await useGetCookies(event);

    const { data, error } = await useGetSession(event, client, currentSession);

    if (error) {
        const { data, error } = await useRefreshSession(client, currentSession);
        if (!data.session || error) return useReturnResponse(event, unauthorizedError);

        useSetCookies(event, data.session);

        return useReturnResponse(event, {
            status: {
                success: true,
                message: "Ok",
                code: 200
            },
            data: await useSetSessionData(event, data.user)
        });
    }

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "gebruiker gevonden",
            code: 200
        },
        data: await useSetSessionData(event, data.user as SupaBaseUser)
    });
});


