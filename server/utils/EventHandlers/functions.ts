
const defineBaseEventHandler = (callback: (event: H3Event, options: { client: SupabaseClient<Database>, user: SupaBaseUser | null, server: SupabaseClient<Database> }) => any) => {
    return defineEventHandler(async (event: H3Event) => {

        const client = await serverSupabaseClient(event);
        const server = serverSupabaseServiceRole(event)

        const { data: user } = await useSessionExists(event, client);

        return callback(event, { client, user: user as SupaBaseUser, server })
    })
};

export const defineSupabaseEventHandler = (callback: (event: H3Event, options: { client: SupabaseClient<Database>, user: SupaBaseUser, server: SupabaseClient<Database>, IsFactorVerified: boolean }) => any) => {
    return defineBaseEventHandler(async (event: H3Event, { client, user, server }) => {

        if (!user) return useReturnResponse(event, unauthorizedError)

        const IsFactorVerified = user.factors && user.factors[0].status === 'verified' || false;

        if (IsFactorVerified && user.aal != 'aal2') return useReturnResponse(event, {
            status: {
                success: false,
                redirect: "/auth/verify",
                message: "MFA verification required",
                code: 401
            }
        })

        return callback(event, { client, user: user as SupaBaseUser, server, IsFactorVerified })
    });
}

export const defineMultiFactorVerificationEventHandler = (callback: (event: H3Event, options: { client: SupabaseClient<Database>, user: SupaBaseUser, server: SupabaseClient<Database> }) => any) => {
    return defineSupabaseEventHandler(async (event: H3Event, { user, client, server, IsFactorVerified }) => {

        if (IsFactorVerified && user.aal == 'aal2') {

            const { data: factors, error: factorError } = await client.auth.mfa.listFactors()
            if (factorError) return useReturnResponse(event, internalServerError)

            const request = await readBody<{ code: string }>(event);

            const { error } = await client.auth.mfa.challengeAndVerify({
                factorId: factors.all[0].id,
                code: request.code
            })

            if (error) return useReturnResponse(event, {
                ...unauthorizedError,
                error: {
                    type: "fields",
                    details: {
                        code: "De opgegeven code is ongeldig."
                    }
                }
            });

        }

        return callback(event, { client, user: user as SupaBaseUser, server })
    })
}

export const defineAuthEventHandler = (callback: (event: H3Event, options: { client: SupabaseClient<Database>, user: SupaBaseUser, server: SupabaseClient<Database> }) => any) => {
    return defineBaseEventHandler(async (event: H3Event, { client, user, server }) => {
        return callback(event, { client, user: user as SupaBaseUser, server })
    })
}

export const defineSupabaseFileHandler = (callback: (event: H3Event, options: { user: SupaBaseUser | null, server: SupabaseClient<Database> }) => any) => {
    return defineBaseEventHandler(async (event: H3Event, { client, user, server }) => {
        return callback(event, { user: user as SupaBaseUser, server })
    })
}
