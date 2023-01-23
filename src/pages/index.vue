<script setup lang="ts">
import { useUserStore } from '#src/stores/userStore'
import { config } from '#src/modules/config'

defineComponent({
  name: 'IndexPage',
})

const userStore = useUserStore()
const user = computed(() => userStore.user)
</script>

<template>
  <div class="index-page">
    <h1 class="capitalize">{{ user?.user_metadata?.full_name }}</h1>

    <h2 class="capitalize">Latest updates</h2>

    <p>...</p>

    <h2 class="capitalize">Other title</h2>

    <p>...</p>
  </div>
</template>
