<script setup lang="ts">
import { netlifyInit } from './modules/github'
// import { config } from './modules/config'

onMounted(() => {
  netlifyInit()
})
</script>

<template>
  <router-view></router-view>
</template>
