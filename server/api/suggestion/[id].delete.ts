import type { Database } from '~~/types/database.types';

import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const params = event.context.params as { id?: string };
  const id = params?.id;

  if (!id) {
    throw createError({
      status: 400,
      message: 'Missing id parameter',
    });
  }

  const client = await serverSupabaseClient<Database>(event);
  const user = await serverSupabaseUser(event);

  if (user == null) {
    throw createError({
      status: 401,
      message: 'Unauthorized',
    });
  }

  const res = await client.from('suggestions').delete().eq('id', Number(id));
  if (res.error) {
    throw createError({
      status: 500,
      message: res.statusText,
    });
  }

  return res;
});
