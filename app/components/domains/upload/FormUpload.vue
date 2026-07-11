<script setup lang="ts">
import type { FormSubmitEvent, RadioGroupItem } from '@nuxt/ui';
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
      maxFileSize: maxFileSize(MB_1 * 500),
    },
  },
);

const forms = mergeRegles({ r$, file$ });

type Schema = InferInput<typeof r$>;

const fileName = computed(() => file$.$value.file?.name);
const fileSize = computed(() => formatFileSize(file$.$value.file?.size ?? 0));

const thumbnailStart = ref(2);
const thumbnailStartingPoints = ref<RadioGroupItem[]>([
  {
    label: '25%',
    id: 1,
  },
  {
    label: '50%',
    id: 2,
  },
  {
    label: '75%',
    id: 3,
  },
]);
const thumbnailFile = ref<Blob | null>(null);
const thumbnailImage = ref('');

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

  thumbnailFile.value = null;
  thumbnailImage.value = '';

  previewUrl.value = '';

  const {
    data: { file },
    valid,
  } = await file$.$validate();

  if (!valid || file == null) {
    return;
  }

  previewUrl.value = URL.createObjectURL(file);

  void setThumbnail(file, thumbnailStart.value);
}

async function setThumbnail(file: File, start: number) {
  const thumbnailBlob = await generateVideoThumbnail(file, start);

  if (thumbnailBlob == null) {
    return;
  }

  thumbnailImage.value = URL.createObjectURL(thumbnailBlob);
  thumbnailFile.value = thumbnailBlob;
}

async function uploadFiles(vId: string) {
  const {
    data: { file },
  } = await file$.$validate();

  if (file == null) {
    return;
  }

  const extension = getFileExtension(file);

  const [res1] = await Promise.all([
    client.storage.from('videos').upload(`${vId}/video.${extension}`, file),
    client.storage.from('videos').upload(`${vId}/thumbnail.jpg`, thumbnailFile.value!),
  ]);

  if (res1.error) {
    console.log(res1.error);
  }
}

watch(thumbnailStart, (newStart) => {
  const file = file$.$value.file;

  URL.revokeObjectURL(thumbnailImage.value);
  void setThumbnail(file!, newStart);
});
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

      <UFormField label="Startpunkt des Thumbnails">
        <URadioGroup
          v-model="thumbnailStart"
          :disabled="file$.$value.file == null"
          value-key="id"
          :items="thumbnailStartingPoints"
          orientation="horizontal"
          variant="table"
          indicator="hidden"
        />
      </UFormField>

      <img
        :src="thumbnailImage"
        width="200"
      >

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
        <video-skin class="w-100">
          <video
            :src="previewUrl"
            playsinline
          />
        </video-skin>
      </video-player>
    </div>
  </div>
</template>
