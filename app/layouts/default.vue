<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui';
import { useMediaQuery } from '@vueuse/core';

const client = useSupabaseClient();
const user = useSupabaseUser();
const { isAdmin } = await useIsAdmin();

const buttonUser = computed(() => ({
  name: user.value?.user_metadata?.full_name,
  avatar: {
    src: user.value?.user_metadata?.picture,
    alt: user.value?.user_metadata?.full_name,
  },
}));

const open = useCookie('sidebar-open', { default: () => true });

const items = [
  {
    label: 'Startseite',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: 'Video vorschlagen',
    icon: 'i-lucide-hand-helping',
    to: '/suggestion',
  },
] as NavigationMenuItem[];

if (isAdmin.value) {
  items.push({
    label: 'Vorschlagsliste',
    icon: 'i-lucide-list-check',
    to: '/suggestion/list',
  });
  items.push({
    label: 'Video hochladen',
    icon: 'i-lucide-circle-plus',
    to: '/upload',
  });
}

const userItems = [
  [
    {
      label: 'Abmelden',
      icon: 'i-lucide-log-out',
      async onSelect() {
        await signOut();
      },
    },
  ],
] as DropdownMenuItem[][];

defineShortcuts({
  ctrl_b: () => (open.value = !open.value),
});

const showSearchInSidebar = useMediaQuery('(max-width: 1024px)');

const loading = ref(false);

async function signOut() {
  loading.value = true;
  const result = await client.auth.signOut({ scope: 'local' });

  if (!result.error) {
    globalThis.location.reload();
  }
}

const router = useRouter();
const searchQuery = ref('');

async function onSearch() {
  if (searchQuery.value) {
    await router.push({ path: '/results', query: { search_query: searchQuery.value }, force: true });
  }
}
</script>

<template>
  <UApp>
    <div class="flex flex-1 flex-col">
      <UHeader
        title="Kultige Videos"
        toggle-side="left"
        :ui="{ container: 'px-4!' }"
      >
        <template #toggle>
          <UButton
            icon="i-lucide-panel-left"
            variant="ghost"
            aria-label="Toggle sidebar"
            @click="open = !open"
          />
        </template>

        <UInput
          v-model.trim="searchQuery"
          size="md"
          variant="outline"
          placeholder="Suchen"
          class="w-sm lg:w-lg"
          @keyup.enter="onSearch"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-search"
              aria-label="Suche starten"
              @click="onSearch"
            />
          </template>
        </UInput>
      </UHeader>

      <div class="flex min-h-0 flex-1">
        <USidebar
          v-model:open="open"
          collapsible="icon"
          :ui="{
            gap: 'h-[calc(100%-var(--ui-header-height))]',
            container: 'absolute top-(--ui-header-height) bottom-0 h-[calc(100%-var(--ui-header-height))]',
            actions: 'w-full'
          }"
        >
          <UNavigationMenu
            :items="items"
            orientation="vertical"
            :ui="{ link: 'p-1.5 overflow-hidden' }"
          />

          <template
            v-if="showSearchInSidebar"
            #actions
          >
            <UInput
              v-model.trim="searchQuery"
              size="md"
              variant="outline"
              placeholder="Suchen"
              class="w-full"
              @keyup.enter="onSearch"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-search"
                  aria-label="Suche starten"
                  @click="onSearch"
                />
              </template>
            </UInput>
          </template>

          <template #footer>
            <UDropdownMenu
              :items="userItems"
              :content="{ align: 'center', collisionPadding: 12 }"
              :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48' }"
            >
              <UButton
                v-bind="buttonUser"
                :label="buttonUser?.name"
                trailing-icon="i-lucide-chevrons-up-down"
                color="neutral"
                variant="ghost"
                square
                class="data-[state=open]:bg-elevated w-full overflow-hidden"
                :ui="{
                  trailingIcon: 'text-dimmed ms-auto'
                }"
              />
            </UDropdownMenu>
          </template>
        </USidebar>

        <UMain class="h-[calc(100vh-var(--ui-header-height))] flex-1 overflow-auto p-4">
          <slot />
        </UMain>
      </div>
    </div>
  </UApp>
</template>
