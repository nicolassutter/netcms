<script setup lang="ts">
import SideBar from '#src/components/SideBar.vue'
import { netlifyInit } from './modules/auth'
// import { config } from './modules/config'

onMounted(() => {
  netlifyInit()
})
</script>

<template>
  <div class="grid grid-cols-[1fr_5fr] min-h-full bg-base">
    <SideBar></SideBar>

    <div class="p-5">
      <router-view></router-view>
    </div>
  </div>
</template>
