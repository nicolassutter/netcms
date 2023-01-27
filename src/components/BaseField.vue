<script setup lang="ts">
import type { AnyField } from '#types/index'
import IconDown from '~icons/carbon/caret-down'

const props = defineProps<{
  field: AnyField
  modelValue: any
  id: string
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
    v-if="field.type === 'text' || field.type === 'email'"
    v-model="model"
    :type="field.type"
    v-bind="{ id }"
  />

  <textarea
    v-else-if="field.type === 'rich'"
    v-model="model"
    v-bind="{ id }"
  ></textarea>

  <div
    v-else-if="field.type === 'select'"
    class="relative"
  >
    <span class="absolute right-3 bottom-0 top-0 flex items-center">
      <IconDown></IconDown>
    </span>

    <select
      v-model="model"
      v-bind="{ id }"
    >
      <option
        v-for="option in field.params.options"
        :key="`option-${option.label}-${option.value}`"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
