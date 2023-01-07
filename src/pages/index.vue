<script setup lang="ts">
import { listContent } from '#src/modules/api'
import { useUserStore } from '#src/stores/userStore'
import { netlifyIdentity } from '#src/modules/auth'
import { config } from '#src/modules/config'

defineComponent({
  name: 'IndexPage',
})

const userStore = useUserStore()
const user = computed(() => userStore.user)
const isLogged = computed(() => userStore.isLogged)

function logout() {
  netlifyIdentity.logout()
}

function openLogin() {
  netlifyIdentity.open()
}

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

    <button
      v-if="!isLogged"
      v-on:click="openLogin"
    >
      Open Login
    </button>

    <button
      v-if="isLogged"
      v-on:click="logout"
    >
      Log out
    </button>
  </div>
</template>
