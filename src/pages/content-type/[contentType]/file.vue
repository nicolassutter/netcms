<script setup lang="ts">
import BaseField from '#src/components/BaseField.vue'
import { readFile, updateFile } from '#src/modules/api'
import { config } from '#src/modules/config'
import type { SingleFile, ContentType } from '#types/index'
import { isEqual } from 'lodash-es'
import type { JsonObject } from 'type-fest'
import { parse, stringify } from 'yaml'
import { parse as parsePath } from 'path-browserify'
import graymatter from 'gray-matter'

defineComponent({
  name: 'IndexPage',
})

const router = useRouter()
const route = useRoute()
const path = route.query.path
const newFile = route.query.new
const _contentType = route.params.contentType

/**
 * The file received from the github api
 */
const file = ref<SingleFile>()

/**
 * The parsed JSON content of the file
 */
const content = ref<JsonObject>()

/**
 * Writable parsed JSON content of the file
 */
const writableContent = ref<JsonObject>()

/**
 * The defined content type in the config
 */
const contentType = ref<ContentType>()

const fileTitle = computed(() =>
  content.value && contentType.value?.title_field
    ? content.value[contentType.value.title_field] ?? 'Untitled'
    : '',
)

const contentHasChanged = computed(() => {
  return !isEqual(content.value, writableContent.value)
})

function initEmptyFields() {
  contentType.value?.fields.forEach((field) => {
    if (!writableContent.value) {
      return
    }

    // If the field does not exist yet
    // TODO: Do we only allow strings ? Or more options, for example, in a select field.
    if (!(field.name in writableContent.value)) {
      writableContent.value[field.name] = ''
    }
  })
}

async function publish() {
  const ext = parsePath(file.value?.path ?? '').ext

  let newContent = JSON.stringify(writableContent.value)

  // json -> yml -> frontmatter
  if (ext === 'md') {
    // const yml = stringify(writableContent.value)
  }

  // json -> yml
  if (ext === 'yml') {
    newContent = stringify(writableContent.value)
  }

  const exists = Boolean(file.value?.sha)

  if (exists && file.value?.path) {
    try {
      await updateFile({
        content: newContent,
        message: `chore: update file "${file.value?.path}"`,
        path: file.value?.path,
        sha: file.value?.sha,
      })

      // The old content becomes the new one
      content.value = JSON.parse(JSON.stringify(writableContent.value))
    } catch (error) {
      throw new Error('failed to update file')
    }
  }

  if (!exists) {
    // await createFile()
  }
}

onMounted(async () => {
  if (typeof path !== 'string' || typeof _contentType !== 'string') {
    router.push('/')
    return
  }

  const fileMeta = await readFile(path)
  file.value = fileMeta

  const _content = atob(fileMeta.content)

  const ext = parsePath(fileMeta.path).ext

  if (ext === 'md') {
    console.log(graymatter(_content).matter)
    // _content = getFrontMatter(_content)
  }

  const json = parse(_content.trim() || '{}')

  content.value = JSON.parse(JSON.stringify(json))
  writableContent.value = JSON.parse(JSON.stringify(json))

  contentType.value = config.content_types?.find(
    (type) => type.name === _contentType,
  )

  initEmptyFields()
})

const { header } = useHeader()
</script>

<template>
  <div
    v-if="content && writableContent"
    class="file-page col-span-full"
  >
    <Teleport
      v-if="header"
      :to="header"
    >
      <ul class="flex items-center h-full ml-auto">
        <li class="ml-auto">
          <button
            class="btn bg-primary hover:not-disabled:bg-primary-focus"
            :disabled="!contentHasChanged"
            v-on:click="publish"
          >
            Publish
          </button>
        </li>
      </ul>
    </Teleport>

    <div class="app-content-grid pt-5">
      <h1 class="capitalize font-bold text-3xl">{{ fileTitle }}</h1>

      <div class="form max-w-xl mt-10">
        <template
          v-for="field in contentType?.fields"
          :key="`field-${contentType.name}-${field.name}`"
        >
          <label
            :for="`field-${field.name}`"
            class="capitalize"
            >{{ field.label ?? field.name }}</label
          >

          <BaseField
            :id="`field-${field.name}`"
            v-model="writableContent[field.name]"
            :type="field.type"
            :name="field.name"
          ></BaseField>
        </template>
      </div>
    </div>
  </div>
</template>
