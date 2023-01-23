<script setup lang="ts">
import SideBar from '#src/components/SideBar.vue'
import IconHome from '~icons/carbon/home'
import IconRocket from '~icons/carbon/rocket'
import IconWeb from '~icons/carbon/wikis'
import { netlifyInit } from '#src/modules/auth'
import { config } from '#src/modules/config'
import type { AnchorHTMLAttributes } from 'vue'

onMounted(() => {
  netlifyInit()
})

const { header } = useHeader()

type Link =
  | {
      label: string
      // any icon type is fine
      icon: typeof IconHome
      classes?: string
      props?: AnchorHTMLAttributes & { to?: string }
    }
  | undefined

const links: Link[] = [
  {
    label: 'Home',
    icon: IconHome,
    props: {
      to: '/',
    },
  },
  {
    label: 'Hooks',
    icon: IconRocket,
    props: {
      to: '/hooks',
    },
  },
  config.site_url
    ? {
        label: 'View site',
        icon: IconWeb,
        classes: 'ml-auto',
        props: {
          href: config.site_url,
          target: '_blank',
          'aria-label': `Open "${config.site_url}" in a new tab`,
        },
      }
    : undefined,
]

const filteredLinks = links.filter(
  (item) => item !== undefined,
) as NonNullable<Link>[]
</script>

<template>
  <div
    class="grid grid-rows-[theme(spacing.16),auto] grid-cols-[minmax(100px,250px)_5fr] min-h-full bg-base"
  >
    <header
      ref="header"
      class="col-span-full bg-neutral border-b border-base-100 px-2 flex items-center"
    >
      <ul class="flex items-cente w-full">
        <li
          v-for="link in filteredLinks"
          :key="`link-${link.label}`"
          class="mr-5"
          :class="link.classes"
        >
          <component
            :is="link.props?.href ? 'a' : 'router-link'"
            v-bind="link.props"
            class="flex items-center hover:text-accent"
          >
            <component :is="link.icon"></component>
            <span class="ml-2">{{ link.label }}</span>
          </component>
        </li>
      </ul>
    </header>

    <SideBar class="col-start-1 row-start-2"></SideBar>

    <main class="app-content-grid col-start-2 row-start-2">
      <router-view></router-view>
    </main>
  </div>
</template>
