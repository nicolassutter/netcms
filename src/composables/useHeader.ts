import { createSharedComposable } from '@vueuse/core'

export const useHeader = createSharedComposable(() => {
  const header = ref<HTMLElement>()
  return { header }
})
