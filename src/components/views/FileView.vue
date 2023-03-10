<script setup lang="ts">
import BaseField from '#src/components/BaseField.vue'
import { createFile, readFile, updateFile } from '#src/modules/api'
import { config } from '#src/modules/config'
import type { SingleFile, ContentType } from '#types/index'
import { isEqual } from 'lodash-es'
import type { JsonObject } from 'type-fest'
import { parse, stringify as stringifyToYaml } from 'yaml'
import { parse as parsePath, join as joinPath } from 'path-browserify'
import slugify from 'slugify'
import { getFrontmatter } from '#src/utils/utils'
import { useNotificationsStore } from '#src/stores/notificationsStore'

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
const notificationsStore = useNotificationsStore()
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
  for (const field of contentType.value?.fields ?? []) {
    if (!writableContent.value) {
      return
    }

    // If the field does not exist yet, initialize it
    if (!(field.name in writableContent.value)) {
      writableContent.value[field.name] =
        'default' in field ? field.default ?? null : null
    }
  }
}

async function publish() {
  const ext = props.isNew
    ? `.${contentType.value?.format}`
    : parsePath(file.value?.path ?? 'unknown.json').ext

  if (!ext) {
    notificationsStore.add({
      content: "Sorry, the file's extension could not be retrieved",
      status: 'error',
    })

    return
  }

  let newStringifiedContent = JSON.stringify(writableContent.value)
  const newContent = JSON.parse(newStringifiedContent)

  // json -> yml -> frontmatter
  if (ext === '.md') {
    // TODO: add the old markdown content after the frontmatter
    const mdContent = ''
    newStringifiedContent = `---\n${stringifyToYaml(
      writableContent.value,
    )}\n---${mdContent}`
  }

  // json -> yml
  if (ext === '.yml') {
    newStringifiedContent = stringifyToYaml(newContent)
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
      content: newStringifiedContent,
      message: `feat: add file "${path}"`,
      path,
    })

    // redirect to the edit page
    router.push(
      `/content-type/${_contentType}/file?path=${createdFile.content.path}`,
    )
  } else if (file.value?.path) {
    try {
      const updateResponse = await updateFile({
        content: newStringifiedContent,
        message: `chore: update file "${file.value?.path}"`,
        path: file.value?.path,
        sha: file.value?.sha,
      })

      // Update the file metadata (most importantly its sha)
      file.value = {
        ...file.value,
        ...updateResponse.content,
      }

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
    try {
      const fileMeta = await readFile(queryPath)
      file.value = fileMeta
      const rawFileContent = atob(fileMeta.content)
      const ext = parsePath(fileMeta.path).ext
      let contentToParse = rawFileContent

      if (ext === '.md') {
        const frontmatter = getFrontmatter(rawFileContent)
        contentToParse = frontmatter
      }

      jsonContent = parse(contentToParse.trim() || '{}')
    } catch (error) {
      notificationsStore.add({
        content: 'Sorry, an error occured while loading your file',
        status: 'error',
      })

      router.push('/')
    }
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
      <ul class="flex items-center h-full ml-5">
        <li class="ml-auto">
          <button
            form="file-view-form"
            type="submit"
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

      <form
        id="file-view-form"
        class="form max-w-xl mt-10"
        aria-label="File edition form"
        v-on:submit.prevent
      >
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
            :field="field"
          ></BaseField>
        </template>
      </form>
    </div>
  </div>
</template>
