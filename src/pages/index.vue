<script setup lang="ts">
import { listContentTypes } from '#src/modules/api'
import { useUserStore } from '#src/stores/userStore'
import { netlifyIdentity } from '../modules/auth'

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
</script>

<template>
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

  <button v-on:click="listContentTypes">List</button>
</template>
