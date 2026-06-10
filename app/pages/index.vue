<script setup lang="ts">
import type { Database } from '~~/types/database.types';

const client = useSupabaseClient<Database>();

const { data: isAdmin } = await useAsyncData('isAdmin', async () => {
  return (await useIsAdmin()).isAdmin.value;
});
const { data: videos } = await useAsyncData('videos-trending', async (_, { signal }) => {
  const { data } = await client.rpc('get_trending_videos', { max_limit: 1000 }).abortSignal(signal);

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
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <UPageCard
        v-for="video of videos"
        :key="video.url_id"
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
          class="aspect-video h-auto w-full rounded-md object-cover"
        >
        <UButton
          v-if="isAdmin"
          class="absolute right-5 bottom-5 z-10 w-fit"
          variant="outline"
          color="warning"
          :to="`/edit?v=${video.url_id}`"
          size="xs"
          icon="i-lucide-pen"
        >
          Edit
        </UButton>
      </UPageCard>
    </div>
  </div>
</template>
