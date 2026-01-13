export default defineSupabaseEventHandler(async (event, { client }) => {

    const { data: factors, error } = await client.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'one_time_code'
    })

    if (error) return useReturnResponse(event, internalServerError)
    
    return {
        status: {
            success: true,
            message: "TOTP factor enrollment initiated",
            code: 200
        },
        data: factors
    }

});