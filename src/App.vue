<script setup lang="ts">
import { netlifyInit } from './modules/github'

onMounted(() => {
  netlifyInit()
})
</script>

<template>
  <router-view></router-view>
</template>
