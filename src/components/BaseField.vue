<script setup lang="ts">
import type { AnyField, GithubFile } from '#types/index'
import { GithubFileSchema } from '#types/index'
import IconDown from '~icons/carbon/caret-down'
import MediaLibraryModal from '#src/components/MediaLibraryModal.vue'
import ModalOverlay from '#src/components/ModalOverlay.vue'
import IconDocument from '~icons/carbon/document'

const props = defineProps<{
  field: AnyField
  modelValue: any
  id: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: ''): void
}>()

function isGithubFile(param: unknown): param is GithubFile {
  try {
    return Boolean(GithubFileSchema.parse(props.modelValue))
  } catch (error) {
    return false
  }
}

const model = computed({
  get() {
    return props.modelValue
  },

  set(v) {
    emit('update:modelValue', v)
  },
})

function isFile(param: unknown): param is File {
  return typeof File !== 'undefined' && param instanceof File
}

const isImg = computed(() => {
  if (!isFile(model.value) && !isGithubFile(model.value)) {
    return false
  }

  return ['.jpeg', '.jpg', '.png', '.ico', '.svg'].some((ext) =>
    model.value.name.includes(ext),
  )
})

const imagePreview = computed(() => {
  if (!isImg.value) {
    return undefined
  }

  if (isGithubFile(model.value)) {
    return model.value.download_url
  }

  return URL.createObjectURL(model.value)
})

const isLibraryOpened = ref(false)
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

  <input
    v-else-if="field.type === 'check'"
    v-model="model"
    type="checkbox"
  />

  <template v-else-if="field.type === 'media'">
    <button
      type="button"
      class="btn btn-primary mt-2"
      v-on:click="() => (isLibraryOpened = true)"
    >
      Choose asset
    </button>

    <Teleport
      v-if="isLibraryOpened"
      to="#modal-root"
    >
      <ModalOverlay v-on:close="() => (isLibraryOpened = false)">
        <MediaLibraryModal
          :multiple="false"
          v-on:submit="
            (selectedAssets) => {
              isLibraryOpened = false
              model = selectedAssets[0]
            }
          "
          v-on:close="() => (isLibraryOpened = false)"
        ></MediaLibraryModal>
      </ModalOverlay>
    </Teleport>

    <p class="mt-2">Selected asset: {{ model.name }}</p>

    <div
      v-if="imagePreview"
      class="mt-5"
    >
      <img
        :src="imagePreview"
        alt=""
      />
    </div>

    <template v-else>
      <div class="bg-base-100 rounded-md p-5 flex items-center justify-center">
        <IconDocument class="w-10 h-10"></IconDocument>
      </div>
    </template>
  </template>

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
