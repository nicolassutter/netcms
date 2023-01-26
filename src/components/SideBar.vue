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
  <aside class="bg-neutral px-5 pt-5 overflow-y-auto">
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
                class="capitaliz btn rounded-md w-full block transition-colors"
                :class="{
                  'bg-base-100 text-accent': isActive(contentType),
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
