import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import 'virtual:windi.css'
import './app.css'
import App from './App.vue'
import { config as pluginConfig, loadConfigFile } from './modules/config'
import { entries } from './utils/utils'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()

export async function init() {
  try {
    const config = await loadConfigFile()

    entries(config).forEach(
      ([key, value]) => (pluginConfig[key] = value as any),
    )
  } catch (error) {
    throw new Error('config file is incorrect')
  }

  createApp(App).use(pinia).use(router).mount('#app')
}
