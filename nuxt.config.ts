// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: 4200,
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000/',
    }
  },
  modules: ['@nuxt/ui'],
  pages: true,
  css: ['~/assets/main.css'],
})