// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui'],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': {
      appMiddleware: ['auth'],
    },
    '/sign-in': {
      appLayout: 'sign-in',
      appMiddleware: ['auth'],
    },
  },

  compatibilityDate: '2025-01-15',

  vite: {
    optimizeDeps: {
      include: ['better-auth/vue'],
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
});
