

export default defineAuthEventHandler(async (event, { client}) => {

    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const currentSession = await useGetCookies(event);
    const { error: userError } = await useGetSession(client, currentSession);

    if (userError) return useReturnResponse(event, unauthorizedError);

    const request = await readBody(event);
    const { error: zodError } = await schema.totp.backend.safeParseAsync(request);

    if (zodError) return useReturnResponse(event, {
        ...badRequestError,
        error: {
            type: "fields",
            details: zodError.issues
        }
    });

    const { data: factors, error: factorError } = await client.auth.mfa.listFactors()
    if (factorError) return useReturnResponse(event, internalServerError)

    const { data, error } = await client.auth.mfa.challengeAndVerify({
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

    const isSetup = getQuery(event).context === "setup";

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: isSetup ? "/account" : '/',
            message: "Ok",
            code: 200
        }
    });

})



