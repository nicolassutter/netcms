<script setup lang="ts">
import SideBar from '#src/components/SideBar.vue'
import IconHome from '~icons/carbon/home'
import { netlifyInit } from '#src/modules/auth'

onMounted(() => {
  netlifyInit()
})

const { header } = useHeader()
</script>

<template>
  <div
    class="grid grid-rows-[theme(spacing.16),auto] grid-cols-[minmax(100px,250px)_5fr] min-h-full bg-base"
  >
    <header
      ref="header"
      class="col-span-full bg-neutral border-b border-base-100 px-2 flex items-center"
    >
      <ul>
        <li>
          <router-link
            to="/"
            class="flex items-center hover:text-accent"
          >
            <IconHome></IconHome>
            <span class="ml-2">Home</span>
          </router-link>
        </li>
      </ul>
    </header>

    <SideBar class="col-start-1 row-start-2"></SideBar>

    <div class="app-content-grid col-start-2 row-start-2">
      <router-view></router-view>
    </div>
  </div>
</template>
