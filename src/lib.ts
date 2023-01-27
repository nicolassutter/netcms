import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './app.css'
import { config as pluginConfig } from './modules/config'
import { entries } from './utils/utils'
import { useUserStore } from './stores/userStore'
import { router } from './router'

// eslint-disable-next-line
// @ts-ignore tsc isn't happy for some reason
import App from './App.vue'

// eslint-disable-next-line
// @ts-ignore tsc isn't happy for some reason
import AppError from './AppError.vue'

import type { Config, FieldsMap, FieldType } from '#types/index'
import { ConfigSchema } from '#types/index'

let userStore: ReturnType<typeof useUserStore>

router.beforeEach((to, _from) => {
  if (!userStore) {
    userStore = useUserStore()
  }

  const toRequireAuth = [true, undefined].includes(to.meta.requireAuth as any)

  if (!userStore.isLogged && toRequireAuth) {
    router.push('/auth')
  }
})

const pinia = createPinia()

export function defineConfig(config: Config) {
  return config
}

export function field<T extends FieldType>(
  type: T,
  fieldDefinition: Omit<FieldsMap[T], 'type'>,
) {
  return { ...fieldDefinition, type }
}

export async function init(config: Config) {
  try {
    // Will throw if config is incorrect
    // FIXME: `params` does not get parsed correctly because of `.or()`
    const parsedConfig = ConfigSchema.parse(config)

    console.log(parsedConfig)

    entries(parsedConfig).forEach(
      ([key, value]) => (pluginConfig[key] = value as any),
    )

    createApp(App).use(pinia).use(router).mount('#app')
  } catch (error) {
    /* eslint-disable-next-line */
    createApp(AppError, { error }).mount('#app')
  }
}
