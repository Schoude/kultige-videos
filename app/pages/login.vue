<script setup lang="ts">
const supabase = useSupabaseClient();

const loading = ref(false);

async function signIn(provider: 'google' | 'kakao') {
  loading.value = true;
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/confirm`,
    },
  });
  if (error) console.log(error);
}
</script>

<template>
  <UMain class="grid h-screen place-items-center">
    <section class="grid gap-6">
      <img
        width="230"
        class="mx-auto"
        src="/logo.webp"
        alt="Logo"
      >
      <h1 class="text-4xl font-semibold">
        Kultige Videos
      </h1>

      <UButton
        label="Google"
        :loading
        icon="i-simple-icons-google"
        block
        variant="outline"
        size="xl"
        @click="signIn('google')"
      />

      <UButton
        label="Kakao"
        :loading
        icon="i-simple-icons-kakao"
        block
        variant="outline"
        size="xl"
        @click="signIn('kakao')"
      />
    </section>
  </UMain>
</template>
