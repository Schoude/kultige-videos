<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';

useHead({
  script: [
    {
      type: 'module',
      src: 'https://cdn.jsdelivr.net/npm/@videojs/html/cdn/video.js',
    },
  ],
});

const router = useRouter();
const vId = useRouteQuery('v');

if (vId == null || vId.value === '') {
  void router.push('/');
}

const client = useSupabaseClient();

const { data: isAdmin } = await useAsyncData('isAdmin', async () => {
  return (await useIsAdmin()).isAdmin.value;
});
const { data: video } = await useAsyncData(
  `video-${vId.value}`,
  async (_, { signal }) => {
    if (vId == null) {
      return null;
    }

    const { data: videoData } = await client
      .from('videos')
      .select('*')
      .eq('url_id', vId.value as string)
      .abortSignal(signal)
      .single();
    const {
      data: { publicUrl },
    } = client.storage.from('videos').getPublicUrl(`${videoData?.url_id}/video.mp4`);

    if (videoData == null) {
      return null;
    }

    const newCount = (videoData.view_count ?? 0) + 1;

    await client
      .from('videos')
      .update({
        view_count: newCount,
      })
      .eq('url_id', vId.value as string);

    videoData.view_count = newCount;

    return {
      url: publicUrl,
      ...videoData,
    };
  },
  { watch: [vId] },
);

const { data: videos } = await useAsyncData(
  'videos-suggestion',
  async (_, { signal }) => {
    const { data } = await client
      .rpc('get_trending_videos', { max_limit: 1000, exclude_url_id: vId.value as string })
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
  },
  { watch: [vId] },
);
</script>

<template>
  <section class="grid grid-cols-1 gap-5 lg:grid-cols-[3fr_1fr]">
    <div>
      <video-player>
        <video-skin class="w-full">
          <video
            class="aspect-video"
            :src="video!.url"
            autoplay
          />
        </video-skin>
      </video-player>

      <h1 class="my-2 text-xl font-semibold">
        <UButton
          v-if="isAdmin"
          class="z-10 w-fit"
          variant="outline"
          color="warning"
          :to="`/edit?v=${video!.url_id}`"
          size="xs"
          icon="i-lucide-pen"
        >
          Edit
        </UButton>
        {{ video!.title }}
      </h1>

      <p class="text-sm">
        {{ video!.view_count }} Aufrufe&nbsp;&nbsp;am {{ new Date(video!.created_at!).toLocaleDateString('de-DE') }}
      </p>
      <p
        v-if="video!.description"
        class="bg-muted mt-2 rounded-md p-2 text-sm"
      >
        {{ video!.description }}
      </p>
    </div>

    <aside class="md:grid md:grid-cols-2 md:gap-5 lg:block">
      <UPageCard
        v-for="videoSuggestion of videos"
        :key="videoSuggestion.url_id"
        role="listitem"
        variant="soft"
        reverse
        :title="videoSuggestion.title"
        :description="videoSuggestion.view_count.toString() + ' Aufrufe'"
        :to="`/watch?v=${videoSuggestion.url_id}`"
      >
        <img
          :src="videoSuggestion.thumbnail"
          alt=""
          class="aspect-video h-auto w-full rounded-md object-cover"
        >
        <UButton
          v-if="isAdmin"
          class="absolute right-5 bottom-5 z-10 w-fit"
          variant="outline"
          color="warning"
          :to="`/edit?v=${videoSuggestion.url_id}`"
          size="xs"
          icon="i-lucide-pen"
        >
          Edit
        </UButton>
      </UPageCard>
    </aside>
  </section>
</template>
