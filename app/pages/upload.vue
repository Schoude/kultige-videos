<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import type { InferInput } from '@regle/core';
import { required, minLength, withMessage } from '@regle/rules';

import { useRegle } from '#imports';

const toast = useToast();
const router = useRouter();
const loading = ref(false);

const { r$ } = useRegle(
  { title: '', description: '' },
  {
    title: { required, minLength: withMessage(minLength(5), 'Must be at least 5 characters') },
    description: {},
  },
);

type Schema = InferInput<typeof r$>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
  loading.value = true;

  await $fetch('/api/upload', {
    method: 'POST',
    body: event.data,
  });

  await router.push('/');
}
</script>

<template>
  <div>
    <h1 class="mb-4 text-2xl">
      Video hochladen
    </h1>
    <UForm
      :schema="r$"
      :state="r$.$value"
      class="space-y-4"
      @submit.prevent="onSubmit"
    >
      <UFormField
        label="Titel"
        name="title"
      >
        <UInput
          v-model="r$.$value.title"
          size="xl"
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
        />
      </UFormField>

      <UButton
        type="submit"
        :loading
      >
        Submit
      </UButton>
    </UForm>
  </div>
</template>
