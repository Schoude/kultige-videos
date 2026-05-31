<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

const button$ = resolveComponent('UButton');

const client = useSupabaseClient();
const {
  data: list,
  refresh,
  status,
} = await useAsyncData('suggestion-list', async (_, { signal }) => {
  const { data } = await client.from('suggestions').select('*').abortSignal(signal);

  if (data == null) {
    return [];
  }

  return data;
});

const deleteId = ref<number | null>(null);
const columns: TableColumn<{
  id: number;
  name: string;
  video_url: string;
  reason: string | null;
  created_at: string;
}>[] = [
  {
    id: 'go-to-video',
    header: '',
    cell: ({ row }) => {
      return h(button$, {
        icon: 'i-lucide-trash',
        size: 'xs',
        color: 'error',
        variant: 'subtle',
        label: 'Vorschlag löschen',
        onClick: () => {
          deleteId.value = row.original.id;
          open.value = true;
        },
      });
    },
  },
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

const open = ref(false);
const isDeleting = ref(false);
async function onDelete() {
  isDeleting.value = true;

  await $fetch(`/api/suggestion/${deleteId.value}`, {
    method: 'DELETE',
  });
  await refresh();

  deleteId.value = null;
  isDeleting.value = false;

  open.value = false;
}
</script>

<template>
  <UMain>
    <h1 class="mb-2 text-2xl">
      Vorschlagsliste
    </h1>

    <UTable
      :columns="columns"
      :data="list"
      :loading="status === 'pending'"
    />

    <UModal
      v-model:open="open"
      title="Vorschlag löschen"
      :dismissable="false"
    >
      <template #body>
        <p>Willst du diesen Vorschlag wirklich löschen?</p>
      </template>

      <template #footer>
        <UButton
          :disabled="isDeleting"
          label="Löschen"
          @click="onDelete()"
        />
      </template>
    </UModal>
  </UMain>
</template>
