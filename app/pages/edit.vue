<script setup lang="ts">
import DangerZone from '~/components/domains/edit/DangerZone.vue';
import FormEdit from '~/components/domains/edit/FormEdit.vue';

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
    .select('id, title, description')
    .eq('url_id', vId as string)
    .abortSignal(signal)
    .single();

  if (videoData == null) {
    return null;
  }

  return videoData;
});

function onDelete() {
  router.push('/');
}
</script>

<template>
  <section>
    <h1 class="mb-4 text-2xl">
      Video bearbeiten
    </h1>

    <FormEdit
      v-if="video"
      :video="video"
    />

    <USeparator class="my-4" />

    <DangerZone
      v-if="video"
      :video-id="video.id"
      @delete="onDelete"
    />
  </section>
</template>
