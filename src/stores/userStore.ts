import type { User } from '#types/index'

export const useUserStore = defineStore('user', () => {
  const user = ref<null | User>(null)
  const isLogged = computed(() => !!user.value)

  return {
    user,
    isLogged,
  }
})
