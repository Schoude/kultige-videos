<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

const client = useSupabaseClient();
const loading = ref(false);
const { data: list } = await useAsyncData('suggestion-list', async (_, { signal }) => {
  loading.value = true;
  const { data } = await client.from('suggestions').select('*').abortSignal(signal);

  loading.value = false;

  if (data == null) {
    return [];
  }

  return data;
});

const columns: TableColumn<{
  id: number;
  name: string;
  video_url: string;
  reason: string | null;
  created_at: string;
}>[] = [
  {
    accessorKey: 'id',
    header: '#',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'video_url',
    header: 'Video URL',
    cell: ({ row }) => {
      const url = row.original.video_url;
      return h('a', { href: url, target: '_blank', class: 'text-blue-500 underline' }, url);
    },
  },
  {
    accessorKey: 'reason',
    header: 'Grund',
  },
  {
    accessorKey: 'created_at',
    header: 'Erstellt am',
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
];
</script>

<template>
  <UMain>
    <h1 class="mb-2 text-2xl">
      Vorschlagsliste
    </h1>

    <UTable
      :columns="columns"
      :data="list"
      :loading="loading"
    />
  </UMain>
</template>
