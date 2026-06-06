<script setup lang="ts">
const supabase = useSupabaseClient();
const route = useRoute();

const { data: isAdmin } = await useAsyncData('isAdmin', async () => {
  return (await useIsAdmin()).isAdmin.value;
});
const { data: videos } = useAsyncData(
  'searchResults',
  async () => {
    if (route.query.search_query == null) {
      return [];
    }

    const { data } = await supabase.rpc('search_videos_ranked', {
      query: route.query.search_query as string,
    });

    if (data == null) {
      return [];
    }

    const withThumbnail = data?.map((vid) => {
      const { data } = supabase.storage.from('videos').getPublicUrl(`${vid.url_id}/thumbnail.jpg`);

      return {
        thumbnail: data.publicUrl,
        ...vid,
      };
    });

    return withThumbnail;
  },
  {
    watch: [() => route.query.search_query],
  },
);
</script>

<template>
  <section>
    <template v-if="videos && videos.length === 0">
      <UEmpty
        icon="i-lucide-video"
        title="Keine Videos gefunden"
        variant="naked"
      />
    </template>

    <template v-else>
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
            class="z-10 w-fit"
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
    </template>
  </section>
</template>
