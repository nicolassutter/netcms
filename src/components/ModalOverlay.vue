<script lang="ts" setup>
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
defineEmits<(e: 'close') => void>()

const el = ref<HTMLElement>()
const { deactivate } = useFocusTrap(el, { immediate: true })
const triggeringElement = ref<HTMLElement>()

onMounted(() => {
  triggeringElement.value = (document.activeElement as HTMLElement) ?? undefined
  el.value?.focus()
})

onBeforeUnmount(() => {
  deactivate()
  triggeringElement.value?.focus()
})
</script>

<template>
  <div
    ref="el"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    class="h-screen w-screen flex items-center justify-center bg-neutral p-10 bg-opacity-60"
    v-on:keyup.esc="$emit('close')"
  >
    <slot></slot>
  </div>
</template>
