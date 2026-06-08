import type { Database } from '~~/types/database.types';

import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const params = event.context.params as { urlId?: string };
  const id = params?.urlId;

  console.log('Deleting video with id:', id);

  if (id == null) {
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

  const storageResponse = await client.storage.from('videos').remove([`${id}/video.mp4`, `${id}/thumbnail.jpg`]);

  console.log('Storage response:', storageResponse);

  if (storageResponse.error) {
    throw createError({
      status: 500,
      message: storageResponse.error.message,
    });
  }

  const res = await client.from('videos').delete().eq('url_id', id);

  if (res.error) {
    throw createError({
      status: 500,
      message: res.statusText,
    });
  }

  return res;
});
