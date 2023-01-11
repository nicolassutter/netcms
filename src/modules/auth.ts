import { useUserStore } from '#src/stores/userStore'
import netlifyIdentity from 'netlify-identity-widget'
import { router } from '#src/lib'

export function netlifyInit() {
  const userStore = useUserStore()

  netlifyIdentity.on('init', async (_user) => {
    userStore.user = _user ?? null
  })

  netlifyIdentity.on('login', async (_user) => {
    userStore.user = _user
    _user.token?.access_token &&
      localStorage.setItem('netlify_token', _user.token.access_token)

    if (router.currentRoute.value.path === '/auth') {
      router.push('/')
    }
  })

  netlifyIdentity.on('logout', async () => {
    userStore.user = null
    localStorage.removeItem('netlify_token')
  })

  netlifyIdentity.on('error', (err) => console.error('Netlify Error', err))

  netlifyIdentity.init({
    locale: 'en', // defaults to 'en'
  })
}

export { netlifyIdentity }
