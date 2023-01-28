<script setup lang="ts">
import { v4 as uuid } from 'uuid'
import { config } from '#src/modules/config'
import type { Hook } from '#types/index'
import { $fetch } from 'ohmyfetch'
import IconRocket from '~icons/carbon/rocket'
import { useNotificationsStore } from '#src/stores/notificationsStore'

defineComponent({
  name: 'HooksPage',
})

const notificationsStore = useNotificationsStore()

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

    notificationsStore.add({
      content: `The ${hook.name} hook was successfully triggered.`,
      status: 'success',
    })
  } catch (error) {
    notificationsStore.add({
      content: `The ${hook.name} hook could not be triggered.`,
      status: 'error',
    })
  }
}
</script>

<template>
  <div class="hooks-page mt-5">
    <h1 class="capitalize font-bold text-3xl">Hooks</h1>

    <table class="mt-5 max-w-xl">
      <tr>
        <th><span class="sr-only">Hook number</span></th>
        <th>Hook name</th>
        <th>Hook description</th>
      </tr>

      <tr
        v-for="(hook, index) in hooks"
        :key="hook.id"
      >
        <td>{{ index + 1 }}</td>

        <td>
          <button
            class="btn btn-secondary flex items-center"
            v-on:click="tryHook(hook)"
          >
            <IconRocket
              aria-hidden="true"
              class="mr-2"
            ></IconRocket>
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
