import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import 'virtual:windi.css'
import './app.css'
import App from './App.vue'
// import type { Config } from '#types/index'
import { config as pluginConfig } from './modules/config'
import { $fetch } from 'ohmyfetch'
import { parse } from 'yaml'
import { call, entries } from './modules/utils'
import type { Config } from '#types/index'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()

export async function init() {
  const yml = await call(async () => {
    try {
      return import.meta.env.PROD
        ? await $fetch('/admin/config.yaml')
        : await $fetch(new URL('./assets/config.yml', import.meta.url).href)
    } catch (error) {
      throw new Error('failed to load config file')
    }
  })

  try {
    const config = parse(yml) as Config

    entries(config).forEach(
      ([key, value]) => (pluginConfig[key] = value as any),
    )
  } catch (error) {
    throw new Error('yaml is incorrect in config file')
  }

  createApp(App).use(pinia).use(router).mount('#app')
}
