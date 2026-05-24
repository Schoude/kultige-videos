<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import type { InferInput } from '@regle/core';
import { required, minLength, maxLength, withMessage, httpUrl } from '@regle/rules';

import { useRegle } from '#imports';

const loading = ref(false);
const { r$ } = useRegle(
  { name: '', videoUrl: '', reason: '' },
  {
    name: {
      required,
      minLength: withMessage(minLength(2), 'Muss min. 2 Zeichen lang sein'),
      maxLength: withMessage(maxLength(50), 'Darf max. 50 Zeichen lang sein'),
    },
    videoUrl: {
      required,
      url: withMessage(httpUrl({ protocol: /^https$/ }), 'Ungültige URL'),
    },
    reason: {
      minLength: withMessage(minLength(5), 'Muss min. 5 Zeichen lang sein'),
      maxLength: withMessage(maxLength(200), 'Darf max. 200 Zeichen lang sein'),
    },
  },
);

type Schema = InferInput<typeof r$>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;

  await $fetch('/api/suggestion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event.data),
  });

  loading.value = false;
}
</script>

<template>
  <UForm
    :schema="r$"
    :state="r$.$value"
    class="mx-auto block w-[50%] space-y-4"
    @submit.prevent="onSubmit"
  >
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <UFormField
        label="Wie heisst du?"
        name="name"
      >
        <UInput
          v-model="r$.$value.name"
          size="xl"
          :ui="{ root: 'w-full' }"
        />
      </UFormField>
      <UFormField
        label="Video-URL"
        name="videoUrl"
      >
        <UInput
          v-model="r$.$value.videoUrl"
          size="xl"
          :ui="{ root: 'w-full' }"
        />
      </UFormField>
    </div>
    <UFormField
      label="Warum ist das Video kultig?"
      name="reason"
    >
      <UTextarea
        v-model="r$.$value.reason"
        size="xl"
        :rows="5"
        :resize="false"
        :ui="{ root: 'w-full' }"
      />
    </UFormField>

    <UButton
      type="submit"
      :loading
      :disabled="r$.$invalid"
    >
      Vorschlag einreichen
    </UButton>
  </UForm>
</template>
