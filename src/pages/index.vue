<script setup lang="ts">
import { listContent } from '#src/modules/api'
import { useUserStore } from '#src/stores/userStore'
import { config } from '#src/modules/config'

defineComponent({
  name: 'IndexPage',
})

const userStore = useUserStore()
const user = computed(() => userStore.user)

const defaultContentType = config.content_types?.at(0)

onMounted(async () => {
  if (defaultContentType) {
    const files = await listContent(defaultContentType?.name)
    console.log(files)
  }
})
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
