<script setup lang="ts">
import type { Database } from '~/types/database.types';

const client = useSupabaseClient<Database>();

const { data: videos } = await useAsyncData('videos', async (_, { signal }) => {
  const { data } = await client.from('videos').select('title, description').order('created_at').abortSignal(signal);

  return data;
});
</script>

<template>
  <div>
    <UPageList
      as="ul"
      :ui="{ base: 'gap-4' }"
    >
      <UPageCard
        v-for="video of videos"
        :key="video.title"
        role="listitem"
        variant="soft"
      >
        <template #body>
          <span>
            {{ video.title }}
          </span>
          <span v-if="video.description">, {{ video.description }}</span>
        </template>
      </UPageCard>
    </UPageList>
  </div>
</template>
