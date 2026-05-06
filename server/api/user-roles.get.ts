import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (user == null) {
    setResponseStatus(event, 404);

    throw createError({
      status: 404,
      message: 'User not found',
    });
  }

  const client = await serverSupabaseClient(event);
  const { data, error } = await client.from('user_roles').select('roles (name)').eq('user_id', user.sub);

  if (error) {
    setResponseStatus(event, 404);

    throw createError({
      status: 404,
      message: 'User not found',
    });
  }

  return data.map(r => r.roles?.name).filter(Boolean);
});
