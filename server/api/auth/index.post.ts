
export default defineEventHandler(async (event) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const request = await readBody(event);
  const { error: zodError } = await schema.login.backend.safeParseAsync(request);

  if (zodError) return useReturnResponse(event, {
    ...badRequestError,
    error: {
      type: "fields",
      details: zodError.issues
    }
  });

  const client: SupabaseClient = await serverSupabaseClient(event);

  const { data, error } = await client.auth.signInWithPassword({
    email: request.email, password: request.password,
  });

  if (error) return useReturnResponse(event, {
    ...unauthorizedError,
    error: {
      type: "fields",
      details: {
        email: ["Onbekende combinatie"],
        password: ["Onbekende combinatie"]
      }
    }
  });


  
  if (data.user.factors) {

    useSetCookies(event, data.session);

    return useReturnResponse(event, {
      status: {
        success: true,
        redirect: "/auth/totp",
        message: "Ok",
        code: 200
      }
    });
  }

  useSetCookies(event, data.session);

  return useReturnResponse(event, {
    status: {
      success: true,
      redirect: "/",
      message: "Ok",
      code: 200
    }
  });
});
