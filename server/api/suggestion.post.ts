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

  const res = await client.from('suggestions').insert({
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.email || 'Unknown User',
    reason: body.reason,
    video_url: body.videoUrl,
  });

  if (res.error) {
    throw createError({
      status: 500,
      message: res.statusText,
    });
  }

  return res;
});
