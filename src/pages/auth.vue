<script setup lang="ts">
import { useUserStore } from '#src/stores/userStore'
import { netlifyIdentity } from '#src/modules/auth'

defineComponent({
  name: 'AuthPage',
})

const router = useRouter()
const userStore = useUserStore()
const isLogged = computed(() => userStore.isLogged)

function logout() {
  netlifyIdentity.logout()
}

function openLogin() {
  netlifyIdentity.open()
}

onMounted(() => {
  if (isLogged.value) {
    router.push('/')
  }
})
</script>

<template>
  <div class="auth-page">
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

<route lang="yml">
meta:
  requireAuth: false
</route>
