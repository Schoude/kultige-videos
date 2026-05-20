import type { Database } from '~~/types/database.types';

import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const client = await serverSupabaseClient<Database>(event);
  const user = await serverSupabaseUser(event);

  if (user == null) {
    throw createError({
      status: 401,
      message: 'Unauthorized',
    });
  }

  const res = await client
    .from('videos')
    .update({
      title: body.title,
      description: body.description,
    })
    .eq('id', body.id);

  if (res.error) {
    throw createError({
      status: 500,
      message: res.statusText,
    });
  }

  return res;
});
