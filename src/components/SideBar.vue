<script setup lang="ts">
import { config } from '#src/modules/config'

defineComponent({
  name: 'SideBar',
})
</script>

<template>
  <ul>
    <li
      v-for="contentType in config.content_types ?? []"
      :key="`content-type-${contentType.name}`"
    >
      <span class="capitalize">{{ contentType.name }}</span>
    </li>
  </ul>
</template>
