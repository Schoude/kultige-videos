<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import { mergeRegles, type InferInput } from '@regle/core';
import { required, minLength, maxLength, withMessage, fileType, maxFileSize } from '@regle/rules';

import { useRegle } from '#imports';

useHead({
  script: [
    {
      type: 'module',
      src: 'https://cdn.jsdelivr.net/npm/@videojs/html/cdn/video.js',
    },
  ],
});
const client = useSupabaseClient();
const toast = useToast();
const router = useRouter();
const loading = ref(false);

const MB_1 = 1_000_000;

const previewUrl = ref('');
const { r$ } = useRegle(
  { title: '', description: '' },
  {
    title: {
      required,
      minLength: withMessage(minLength(5), 'Muss min. 5 Zeichen lang sein'),
      maxLength: withMessage(maxLength(300), 'Darf max. 300 Zeichen lang sein'),
    },
    description: {},
  },
);

const { r$: file$ } = useRegle(
  { file: null as File | null },
  {
    file: {
      required,
      fileType: fileType(['video/mp4']),
      maxFileSize: maxFileSize(MB_1 * 100),
    },
  },
);

const forms = mergeRegles({ r$, file$ });

type Schema = InferInput<typeof r$>;

const fileName = computed(() => file$.$value.file?.name);
const fileSize = computed(() => formatFileSize(file$.$value.file?.size ?? 0));

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;

  const vId = generateVideoId();
  await uploadFiles(vId);

  await $fetch('/api/upload', {
    method: 'POST',
    body: {
      ...event.data,
      url_id: vId,
    },
  });

  toast.add({ title: 'Erfolg', description: 'Das Video wurde erfolgreich gespeichert', color: 'success' });

  await router.push('/');
}

async function onSelectFile() {
  if (previewUrl.value !== '') {
    URL.revokeObjectURL(previewUrl.value);
  }

  previewUrl.value = '';

  const {
    data: { file },
    valid,
  } = await file$.$validate();

  if (!valid || file == null) {
    return;
  }
  previewUrl.value = URL.createObjectURL(file);
}

async function uploadFiles(vId: string) {
  const {
    data: { file },
  } = await file$.$validate();

  if (file == null) {
    return;
  }

  const extension = getFileExtension(file);

  const res = await client.storage.from('videos').upload(`${vId}/video.${extension}`, file);

  if (res.error) {
    console.log(res.error);
  }
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
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
          :ui="{ root: 'w-full' }"
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
          :ui="{ root: 'w-full' }"
        />
      </UFormField>

      <UButton
        type="submit"
        :loading
        :disabled="forms.$invalid"
      >
        Video speichern
      </UButton>
    </UForm>

    <div>
      <UForm :state="file$.$value">
        <UFormField>
          <UFileUpload
            v-model="file$.$value.file"
            label="Wähle eine Videodatei aus"
            dropzone
            accept="video/*"
            class="min-h-60"
            @change="onSelectFile"
          />
          <template #help>
            <p
              v-if="file$.$value.file"
              class="flex gap-2"
            >
              <span>
                Ausgewählte Datei: <span class="text-secondary">{{ fileName }}</span>
              </span>
              <span>
                Dateigröße: <span class="text-secondary">{{ fileSize }}</span>
              </span>
            </p>
          </template>
        </UFormField>
      </UForm>
      <video-player v-if="previewUrl">
        <video-skin class="w-150">
          <video
            :src="previewUrl"
            playsinline
          />
        </video-skin>
      </video-player>
    </div>
  </div>
</template>
