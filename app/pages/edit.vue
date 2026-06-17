<script setup lang="ts">
import DangerZone from '~/components/domains/edit/DangerZone.vue';
import FormEdit from '~/components/domains/edit/FormEdit.vue';

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
const { data: video } = await useAsyncData(`video-edit-${vId}`, async (_, { signal }) => {
  if (vId == null) {
    return null;
  }

  const { data: videoData } = await client
    .from('videos')
    .select('id, title, description, url_id')
    .eq('url_id', vId as string)
    .abortSignal(signal)
    .single();

  if (videoData == null) {
    return null;
  }
  const {
    data: { publicUrl },
  } = client.storage.from('videos').getPublicUrl(`${videoData?.url_id}/video.mp4`);

  return {
    ...videoData,
    url: publicUrl,
  };
});

function onDelete() {
  router.push('/');
}
</script>

<template>
  <section class="grid grid-cols-1 gap-5 lg:grid-cols-2">
    <div>
      <h1 class="mb-4 text-2xl">
        Video bearbeiten
      </h1>

      <FormEdit
        v-if="video"
        :video="video"
      />

      <USeparator class="my-4" />

      <DangerZone
        v-if="video && vId"
        :url-id="vId as string"
        @delete="onDelete"
      />
    </div>

    <video-player v-if="video">
      <video-skin>
        <video
          class="aspect-video"
          :src="video!.url"
        />
      </video-skin>
    </video-player>
  </section>
</template>
