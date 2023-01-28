<script setup lang="ts">
import SideBar from '#src/components/SideBar.vue'
import IconHome from '~icons/carbon/home'
import IconRocket from '~icons/carbon/rocket'
import IconWeb from '~icons/carbon/wikis'
import IconLogout from '~icons/carbon/logout'
import { netlifyIdentity, netlifyInit } from '#src/modules/auth'
import { config } from '#src/modules/config'
import type { AnchorHTMLAttributes, Raw } from 'vue'
import { useUserStore } from './stores/userStore'
import NotificationsContainer from '#src/components/NotificationsContainer.vue'

onMounted(() => {
  netlifyInit()
})

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const { header } = useHeader()

type Link =
  | {
      tag: string
      label: string
      // any icon type is fine, it just need to be made non reactive for vue
      icon: Raw<typeof IconHome>
      classes?: string
      props?: AnchorHTMLAttributes & { to?: string }
      events?: Record<string, (e: Event) => void>
    }
  | undefined

const links = computed<Link[]>(() => [
  {
    tag: 'router-link',
    label: 'Home',
    icon: markRaw(IconHome),
    props: {
      to: '/',
    },
  },
  {
    tag: 'router-link',
    label: 'Hooks',
    icon: markRaw(IconRocket),
    props: {
      to: '/hooks',
    },
  },
  config.site_url
    ? {
        tag: 'a',
        label: 'View site',
        icon: markRaw(IconWeb),
        classes: 'ml-auto',
        props: {
          href: config.site_url,
          target: '_blank',
          'aria-label': `Open "${config.site_url}" in a new tab`,
        },
      }
    : undefined,
  userStore.isLogged
    ? {
        tag: 'button',
        label: 'Logout',
        icon: markRaw(IconLogout),
        events: {
          click: async () => {
            await netlifyIdentity.logout()
            router.push('/auth')
          },
        },
      }
    : undefined,
])

const filteredLinks = computed(
  () => links.value.filter((item) => item !== undefined) as NonNullable<Link>[],
)
</script>

<template>
  <div class="bg-base h-full">
    <nav
      role="navigation"
      class="skip-links"
    >
      <ul class="p-2">
        <li>
          <a
            class="block p-2 rounded"
            href="#main"
            >Go to main content</a
          >
        </li>
      </ul>
    </nav>

    <NotificationsContainer
      class="fixed top-0 right-0"
    ></NotificationsContainer>

    <!-- Auth is a fullpage view -->
    <main
      v-if="route.path === '/auth'"
      id="main"
      role="main"
      tabindex="-1"
      class="h-full w-full"
    >
      <router-view></router-view>
    </main>

    <div
      v-else
      class="grid grid-rows-[theme(spacing.16),auto] grid-cols-[minmax(100px,250px)_5fr] min-h-full bg-base"
    >
      <header
        ref="header"
        class="col-span-full bg-neutral px-5 flex items-center"
      >
        <ul class="flex items-cente w-full">
          <li
            v-for="link in filteredLinks"
            :key="`link-${link.label}`"
            class="mr-5 last:mr-0"
            :class="link.classes"
          >
            <component
              :is="link.tag"
              v-bind="link.props"
              class="flex btn items-center hover:text-accent hover:bg-base-100"
              v-on="link.events ?? {}"
            >
              <component :is="link.icon"></component>
              <span class="ml-2">{{ link.label }}</span>
            </component>
          </li>
        </ul>
      </header>

      <SideBar class="col-start-1 row-start-2"></SideBar>

      <main
        id="main"
        role="main"
        tabindex="-1"
        class="app-content-grid col-start-2 row-start-2"
      >
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<style scoped lang="pcss">
.router-link-active {
  @apply bg-base-100 text-accent;
}

.skip-links {
  opacity: 0;
  height: 0;
  overflow: hidden;

  &:focus-within {
    opacity: 1;
    height: auto;
  }
}
</style>
