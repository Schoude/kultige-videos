<script setup lang="ts">
const supabase = useSupabaseClient();
const route = useRoute();

const { data } = useAsyncData('searchResults', async () => {
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
});
</script>

<template>
  <section>
    <h1 class="text-4xl font-semibold">
      Ergebnisse
    </h1>
    <p> {{ data }}</p>
  </section>
</template>
