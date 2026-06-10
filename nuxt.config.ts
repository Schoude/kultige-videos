// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/supabase', '@regle/nuxt'],

  devtools: {
    enabled: true,
  },
  app: {
    head: {
      title: 'Kultige Videos',
      meta: [{ name: 'apple-mobile-web-app-title', content: 'Kultige Videos' }],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('video'),
    },
  },

  routeRules: {
    '/login': {
      appLayout: 'login',
    },
    '/confirm': {
      appLayout: 'confirm',
    },
    '/upload': {
      appMiddleware: ['admin'],
    },
    '/edit': {
      appMiddleware: ['admin'],
    },
    '/suggestion/list': {
      appMiddleware: ['admin'],
    },
  },

  compatibilityDate: '2025-01-15',

  vite: {
    optimizeDeps: {
      include: ['@regle/core', '@regle/rules', '@vueuse/core', 'nanoid'],
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  regle: {
    setupFile: '~/regle-config.ts',
  },

  supabase: {
    types: '~~/types/database.types',
  },
});
