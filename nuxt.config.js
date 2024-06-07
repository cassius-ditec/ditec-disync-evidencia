export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'diSync powered by DITEC Brasil',
    htmlAttrs: {
      lang: 'pt-br'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'view-design/dist/styles/iview.css',
    '~/assets/css/global.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/view-ui',
    { src: '@/plugins/maps', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    '~/components',
    { path: '~/components/Mapa/', prefix: 'Mapa' },
    { path: '~/components/Relacional/', prefix: 'Relacional' },
    { path: '~/components/Dashboard/', prefix: 'Dashboard' }
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/moment',
  ],

  moment: {
    defaultLocale: 'pt-br',
    locales: ['pt-br'],
    defaultTimezone: 'America/Sao_Paulo',
    timezone: true,
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    proxy: true,
    baseURL: '/api/'
  },
  proxy: {
    "/api/": {
      target: process.env.API,
      changeOrigin: true,
      secure: false
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^vue2-google-maps($|\/)/]
  },
  publicRuntimeConfig: {
    limitPage: 100,
    serverWS: process.env.WS,
    api: process.env.API
  },
}
