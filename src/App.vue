<script setup lang="ts">
import SideBar from '#src/components/SideBar.vue'
import { netlifyInit } from './modules/auth'
// import { config } from './modules/config'

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
      class="col-span-full bg-neutral border-b border-base-100 px-2"
    ></header>

    <SideBar class="col-start-1 row-start-2"></SideBar>

    <div class="app-content-grid col-start-2 row-start-2">
      <router-view></router-view>
    </div>
  </div>
</template>
