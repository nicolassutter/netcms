<script setup lang="ts">
import type { FieldType } from '#types/index'

const props = defineProps<{
  type: FieldType
  modelValue: any
  name: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: ''): void
}>()

const model = computed({
  get() {
    return props.modelValue
  },

  set(v) {
    emit('update:modelValue', v)
  },
})
</script>

<template>
  <input
    v-if="type === 'text'"
    v-model="model"
    type="text"
    class=""
  />

  <input
    v-else-if="type === 'email'"
    v-model="model"
    type="email"
  />

  <textarea
    v-else-if="type === 'rich'"
    v-model="model"
  ></textarea>
</template>
