<script setup lang="ts">
import { config } from '#src/modules/config'
import type { ContentType } from '#types/index'

defineComponent({
  name: 'SideBar',
})

const route = useRoute()

function isActive(contentType: ContentType) {
  return route.params.contentType === contentType.name
}
</script>

<template>
  <aside class="bg-neutral px-2 pt-5">
    <nav>
      <h2 class="font-semibold text-lg">Content types</h2>

      <ul class="mt-3">
        <li
          v-for="contentType in config.content_types ?? []"
          :key="`content-type-${contentType.name}`"
          class="w-full"
        >
          <router-link
            :to="`/content-type/${contentType.name}`"
            custom
          >
            <template v-slot:default="{ href, navigate }">
              <a
                :href="href"
                class="capitalize rounded-sm p-3 w-full block transition-colors"
                :class="{
                  'bg-secondary text-secondary-content hover:bg-secondary-focus':
                    isActive(contentType),
                  'hover:bg-base-100': !isActive(contentType),
                }"
                v-on:click="navigate"
              >
                {{ contentType.name }}
              </a>
            </template>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>
