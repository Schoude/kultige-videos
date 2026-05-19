<script setup lang="ts">
useHead({
  script: [
    {
      type: 'module',
      src: 'https://cdn.jsdelivr.net/npm/@videojs/html/cdn/video.js',
    },
  ],
});

const router = useRouter();
const route = useRoute();
const vId = route.query.v;

if (vId == null || vId === '') {
  void router.push('/');
}

const client = useSupabaseClient();

const { data: video } = await useAsyncData(`video-${vId}`, async (_, { signal }) => {
  if (vId == null) {
    return null;
  }

  const { data: videoData } = await client
    .from('videos')
    .select('*')
    .eq('url_id', vId as string)
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
    .eq('url_id', vId as string);

  videoData.view_count = newCount;

  return {
    url: publicUrl,
    ...videoData,
  };
});
</script>

<template>
  <section>
    <video-player>
      <video-skin class="w-[66%]">
        <video
          class="aspect-video"
          :src="video!.url"
          autoplay
        />
      </video-skin>
    </video-player>

    <h1 class="my-2 text-xl font-semibold">
      {{ video!.title }}
    </h1>

    <p class="text-sm">
      {{ video!.view_count }} Aufrufe&nbsp;&nbsp;am {{ new Date(video!.created_at!).toLocaleDateString('de-DE') }}
    </p>
    <p class="bg-muted mt-2 rounded-md p-2 text-sm">
      {{ video!.description }}
    </p>
  </section>
</template>
