import type { User } from 'netlify-identity-widget'

export const useUserStore = defineStore('user', () => {
  const user = ref<null | User>(null)
  const isLogged = computed(() => !!user.value)

  return {
    user,
    isLogged,
  }
})
