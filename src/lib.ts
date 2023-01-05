import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import 'virtual:windi.css'
import './app.css'
import App from './App.vue'
import type { Config } from '#types/index'
import { config as pluginConfig } from './modules/config'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()

export function defineConfig(config: Config) {
  return config
}

export function init(config: Config) {
  Object.entries(config).forEach(
    ([key, value]) => (pluginConfig[key as keyof Config] = value),
  )

  createApp(App).use(pinia).use(router).mount('#app')
}
