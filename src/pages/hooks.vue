<script setup lang="ts">
import { v4 as uuid } from 'uuid'
import { config } from '#src/modules/config'
import type { Hook } from '#types/index'
import { $fetch } from 'ohmyfetch'

defineComponent({
  name: 'HooksPage',
})

const hooks = computed(
  () =>
    config.hooks?.map((hook) => ({
      ...hook,
      id: uuid(),
    })) ?? [],
)

async function tryHook(hook: Hook) {
  try {
    if (!hook.url) {
      throw new Error('Err: please provide a valid hook url')
    }

    await $fetch(hook.url)
    // TODO: diplay success toast
  } catch (error) {
    // TODO: Handle error
  }
}
</script>

<template>
  <div class="hooks-page">
    <h2>Hooks</h2>

    <ul class="flex flex-wrap gap-3 mt-5">
      <li
        v-for="hook in hooks"
        :key="hook.id"
      >
        <button
          class="btn bg-info text-info-content"
          v-on:click="tryHook(hook)"
        >
          {{ hook.name }}
        </button>
      </li>
    </ul>
  </div>
</template>
