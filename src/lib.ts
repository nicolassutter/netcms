import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './app.css'
import { config as pluginConfig, loadConfigFile } from './modules/config'
import { entries } from './utils/utils'
import { useUserStore } from './stores/userStore'
import { router } from './router'

// eslint-disable-next-line
// @ts-ignore tsc isn't happy for some reason
import App from './App.vue'

router.beforeEach((to, _from) => {
  const userStore = useUserStore()
  const toRequireAuth = [true, undefined].includes(to.meta.requireAuth as any)

  if (!userStore.isLogged && toRequireAuth) {
    router.push('/auth')
  }
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
