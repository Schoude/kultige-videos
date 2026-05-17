<script setup lang="ts">
import type { Database } from '~~/types/database.types';

const client = useSupabaseClient<Database>();

const { data: videos } = await useAsyncData('videos', async (_, { signal }) => {
  const { data } = await client
    .from('videos')
    .select('title, description, url_id, view_count')
    .order('created_at')
    .abortSignal(signal);

  if (data == null) {
    return [];
  }

  const withThumbnail = data?.map((vid) => {
    const { data } = client.storage.from('videos').getPublicUrl(`${vid.url_id}/thumbnail.jpg`);

    return {
      thumbnail: data.publicUrl,
      ...vid,
    };
  });

  return withThumbnail;
});
</script>

<template>
  <div>
    <UPageColumns>
      <UPageCard
        v-for="video of videos"
        :key="video.title"
        role="listitem"
        variant="soft"
        reverse
        :title="video.title"
        :description="video.view_count.toString() + ' Aufrufe'"
        :to="`/watch?v=${video.url_id}`"
      >
        <img
          :src="video.thumbnail"
          alt=""
          class="rounded-md"
        >
      </UPageCard>
    </UPageColumns>
  </div>
</template>
