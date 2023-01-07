<script setup lang="ts">
import { config } from '#src/modules/config'

defineComponent({
  name: 'SideBar',
})
</script>

<template>
  <ul class="bg-neutral">
    <li
      v-for="contentType in config.content_types ?? []"
      :key="`content-type-${contentType.name}`"
    >
      <router-link
        :to="`/content-type/${contentType.name}`"
        class="capitalize"
        >{{ contentType.name }}</router-link
      >
    </li>
  </ul>
</template>
