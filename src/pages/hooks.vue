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

    <table class="mt-5">
      <tr>
        <th>Hook</th>
        <th>Hook description</th>
      </tr>

      <tr
        v-for="hook in hooks"
        :key="hook.id"
      >
        <td>
          <button
            class="btn btn-secondary"
            v-on:click="tryHook(hook)"
          >
            {{ hook.name }}
          </button>
        </td>

        <td>
          <p>{{ hook.description ?? 'No description provided' }}</p>
        </td>
      </tr>
    </table>
  </div>
</template>
