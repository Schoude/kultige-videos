<script setup lang="ts">
import { sameAs, withMessage, required } from '@regle/rules';

import { useRegle } from '#imports';

const { videoId } = defineProps<{
  videoId: string | null;
}>();
const emit = defineEmits<{
  delete: [];
}>();

const open = ref(false);
const isDeleting = ref(false);

const { r$ } = useRegle(
  { confirmText: '' },
  {
    confirmText: {
      required: withMessage(required, 'Du musst "delete" eingeben, um fortzufahren.'),
      sameAs: withMessage(
        sameAs(() => 'delete'),
        'Du musst "delete" eingeben, um fortzufahren.',
      ),
    },
  },
);
async function onDelete() {
  const { valid } = await r$.$validate();

  if (!valid) {
    return;
  }

  if (videoId == null) {
    return;
  }

  isDeleting.value = true;

  await $fetch('/api/delete', {
    method: 'DELETE',
    body: {
      id: videoId,
    },
  });

  open.value = false;
  emit('delete');
  isDeleting.value = false;
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">
      Danger Zone
    </h2>
    <p class="text-sm">
      Hier kannst du dein Video löschen. Diese Aktion kann nicht rückgängig gemacht werden.
    </p>
    <UButton
      label="Video löschen"
      color="error"
      variant="outline"
      @click="open = true"
    />
  </div>

  <UModal
    v-model:open="open"
    title="Video löschen"
    description="Willst du dieses Video wirklich löschen?"
    :dismissable="false"
  >
    <template #body>
      <p>Schreibe <b>delete</b> in das Feld zum Bestätigen.</p>

      <form
        id="delete-video"
        @submit.prevent="onDelete"
      >
        <UInput
          v-model="r$.$value.confirmText"
          class="mt-4 w-full"
          placeholder="Bestätigungstext"
          :color="r$.$invalid ? 'error' : 'primary'"
        />
      </form>
    </template>

    <template #footer>
      <UButton
        form="delete-video"
        :disabled="r$.$invalid"
        label="Löschen"
        variant="outline"
        color="error"
        :loading="isDeleting"
      />
    </template>
  </UModal>
</template>
