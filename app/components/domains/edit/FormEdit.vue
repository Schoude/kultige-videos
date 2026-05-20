<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import type { InferInput } from '@regle/core';
import { required, minLength, maxLength, withMessage } from '@regle/rules';

const { video } = defineProps<{
  video: {
    id: string;
    title: string;
    description: string | null;
  };
}>();

const loading = ref(false);
const { r$ } = useRegle(
  { title: video.title, description: video.description ?? '' },
  {
    title: {
      required,
      minLength: withMessage(minLength(5), 'Muss min. 5 Zeichen lang sein'),
      maxLength: withMessage(maxLength(300), 'Darf max. 300 Zeichen lang sein'),
    },
    description: {},
  },
);

type Schema = InferInput<typeof r$>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  await $fetch('/api/edit', {
    method: 'PATCH',
    body: {
      ...event.data,
      id: video.id,
    },
  });
  loading.value = false;
}
</script>

<template>
  <div>
    <UForm
      :schema="r$"
      :state="r$.$value"
      class="space-y-4"
      @submit.prevent="onSubmit"
    >
      <UFormField
        label="Titel"
        name="title"
        block
      >
        <UInput
          v-model="r$.$value.title"
          size="xl"
          :ui="{ root: 'w-[50vw]' }"
        />
      </UFormField>

      <UFormField
        label="Beschreibung"
        name="description"
      >
        <UTextarea
          v-model="r$.$value.description"
          size="xl"
          :rows="5"
          :resize="false"
          :ui="{ root: 'w-[50vw]' }"
        />
      </UFormField>

      <div class="flex w-[50vw] justify-between">
        <UButton
          type="submit"
          :loading
          :disabled="r$.$invalid || loading || !r$.$anyEdited"
        >
          Video speichern
        </UButton>
        <UButton
          type="button"
          variant="soft"
          color="warning"
          :disabled="!r$.$anyEdited || loading"
          @click="r$.$reset({ toOriginalState: true })"
        >
          Änderungen zurücksetzen
        </UButton>
      </div>
    </UForm>
  </div>
</template>
