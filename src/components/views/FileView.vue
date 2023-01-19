<script setup lang="ts">
import BaseField from '#src/components/BaseField.vue'
import { createFile, readFile, updateFile } from '#src/modules/api'
import { config } from '#src/modules/config'
import type { SingleFile, ContentType } from '#types/index'
import { isEqual } from 'lodash-es'
import type { JsonObject } from 'type-fest'
import { parse, stringify as stringifyToYaml } from 'yaml'
import { parse as parsePath, join as joinPath } from 'path-browserify'
import graymatter from 'gray-matter'
import slugify from 'slugify'

const props = withDefaults(
  defineProps<{
    /**
     * @default false
     */
    isNew?: boolean
  }>(),
  {
    isNew: false,
  },
)

const router = useRouter()
const route = useRoute()
const queryPath = route.query.path
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

const newFileTitle = computed(
  () =>
    `${
      writableContent.value && contentType.value?.title_field
        ? writableContent.value[contentType.value.title_field] ?? 'Untitled'
        : ''
    }`,
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
  const ext = props.isNew
    ? contentType.value?.format
    : parsePath(file.value?.path ?? 'unknown.json').ext

  if (!ext) {
    // TODO: add toast
    throw new Error('Extension could not be retrieved')
  }

  let newContent = JSON.stringify(writableContent.value)

  // json -> yml -> frontmatter
  if (ext === '.md') {
    newContent = stringifyToYaml(writableContent.value)
  }

  // json -> yml
  if (ext === '.yml') {
    newContent = stringifyToYaml(writableContent.value)
  }

  const exists = Boolean(file.value?.sha)

  if (!config.content_dir || typeof _contentType !== 'string') {
    return
  }

  if (!exists) {
    const path = `${joinPath(
      config.content_dir,
      _contentType,
      slugify(newFileTitle.value),
    )}${ext}`

    const createdFile = await createFile({
      content: newContent,
      message: `feat: add file "${path}"`,
      path,
    })

    // redirect to the edit page
    router.push(
      `/content-type/${_contentType}/file?path=${createdFile.content.path}`,
    )
  } else if (file.value?.path) {
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
}

onMounted(async () => {
  const isAllowed =
    typeof _contentType === 'string' &&
    (typeof queryPath === 'string' || props.isNew)

  if (!isAllowed) {
    router.push('/')
    return
  }

  let jsonContent: JsonObject | undefined

  // Only query Github if the file exists
  if (typeof queryPath === 'string') {
    const fileMeta = await readFile(queryPath)
    file.value = fileMeta

    const rawFileContent = atob(fileMeta.content)
    const ext = parsePath(fileMeta.path).ext

    if (ext === 'md') {
      console.log(graymatter(rawFileContent).matter)
      // _content = getFrontMatter(_content)
    }

    jsonContent = parse(rawFileContent.trim() || '{}')
  }

  jsonContent ??= {}

  // Deep copy the object twice so they don't mutate each other
  content.value = JSON.parse(JSON.stringify(jsonContent))
  writableContent.value = JSON.parse(JSON.stringify(jsonContent))

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
      <h1 class="capitalize font-bold text-3xl">{{ newFileTitle }}</h1>

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
