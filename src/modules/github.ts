import { useUserStore } from '#src/stores/userStore'
import type { User } from '#types/index'
import netlifyIdentity from 'netlify-identity-widget'

export function netlifyInit() {
  const userStore = useUserStore()

  netlifyIdentity.on('init', async (_user: User | null) => {
    console.log(_user)
    userStore.user = _user ?? null
  })

  netlifyIdentity.on('login', async (_user: User) => {
    userStore.user = _user
  })

  netlifyIdentity.on('logout', async (_user: User) => {
    userStore.user = null
  })

  netlifyIdentity.init({
    locale: 'en', // defaults to 'en'
  })
}

export { netlifyIdentity }
