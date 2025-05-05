// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: 3000,
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:4500/',
    }
  },
  modules: ['@nuxt/ui'],
  pages: true,
  css: ['~/assets/main.css'],
})