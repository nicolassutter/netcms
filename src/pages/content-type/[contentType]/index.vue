<script setup lang="ts">
import { deleteFile, listContent } from '#src/modules/api'
// import { config } from '#src/modules/config'
import { parse } from 'path-browserify'
import type { File } from '#types/index'
import IconAdd from '~icons/carbon/add'
import IconArrowRight from '~icons/carbon/arrow-right'
import IconDelete from '~icons/carbon/trash-can'
import IconSearch from '~icons/carbon/search'
import { useNotificationsStore } from '#src/stores/notificationsStore'
import Fuse from 'fuse.js'

defineComponent({
  name: 'IndexPage',
})

const router = useRouter()
const route = useRoute()
const contentTypeName = computed(() => route.params.contentType)
const notificationsStore = useNotificationsStore()
const isLoading = ref(false)

const files = ref<File[]>()
const filterValue = ref('')

function getFileTitle(item: File) {
  const parsedName = parse(item.name)
  return `${parsedName.name}`
}

const selectedFiles = ref<File[]>([])

async function init() {
  if (typeof contentTypeName.value !== 'string') {
    router.push('/')
    return
  }

  try {
    isLoading.value = true
    const contentFiles = await listContent(contentTypeName.value)
    files.value = contentFiles
  } catch (error) {
    if (error instanceof Error && error.message === 'ECT404') {
      notificationsStore.add({
        content:
          'The specified content type could not be found in the repo. A new folder will therefore be created.',
        status: 'warning',
      })

      files.value = []
    }

    if (error instanceof Error && error.message === 'ECT404-1') {
      notificationsStore.add({
        content: 'The specified content type does not exist in your config.',
        status: 'error',
      })

      router.push('/')
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * Delete selected files serially,
 * it will not work if done in parallel.
 */
async function deleteFiles() {
  const pathsToDelete: string[] = []
  let hasError = false

  for await (const file of selectedFiles.value) {
    try {
      await deleteFile({
        message: `chore: delete file "${file.path}"`,
        path: file.path,
        sha: file.sha,
      })

      pathsToDelete.push(file.path)
    } catch (error) {
      hasError = true

      notificationsStore.add({
        content: `The file "${file.path}" could not be deleted`,
        status: 'error',
      })
    }
  }

  // Update state
  selectedFiles.value = selectedFiles.value.filter(
    (file) => !pathsToDelete.includes(file.path),
  )

  notificationsStore.add({
    content: hasError
      ? 'Some of your files have been deleted.'
      : 'Your files have been deleted.',
    status: 'success',
  })
}

const fuse = new Fuse([] as File[], {
  keys: ['path'] satisfies (keyof File)[],
})

const filteredFiles = ref<File[] | undefined>()

const filesToDisplay = computed(() => {
  const _files = filteredFiles.value ?? files.value ?? []

  return _files.map((item) => ({
    ...item,
    file_title: getFileTitle(item),
  }))
})

function resetFilter() {
  filteredFiles.value = undefined
}

function filterFiles() {
  if (!filterValue.value) {
    resetFilter()
    return
  }

  fuse.setCollection(files.value ?? [])
  const results = fuse.search(filterValue.value)
  filteredFiles.value = results.map((item) => item.item)
}

onMounted(async () => {
  init()
})

watch(contentTypeName, () => {
  /**
   * Only if we are still on this view,
   * for example if we enter another view the watcher gets triggered
   * even though it is useles since we are on a new route.
   */
  if (route.path.includes('/content-type')) {
    init()
  }
})
</script>

<template>
  <div class="content-type-page mt-5">
    <p
      v-if="isLoading"
      class=""
    >
      Loading...
    </p>

    <template v-else>
      <h1 class="capitalize font-bold text-3xl">{{ contentTypeName }}</h1>

      <div class="flex flex-wrap gap-5 mt-5">
        <router-link
          class="btn btn-primary w-max"
          :to="`/content-type/${contentTypeName}/file/new`"
        >
          <IconAdd
            aria-hidden="true"
            class="mr-2"
          ></IconAdd>
          Create new "{{ contentTypeName }}"
        </router-link>

        <button
          class="btn btn-secondary w-max"
          :to="`/content-type/${contentTypeName}/file/new`"
          :disabled="selectedFiles.length === 0"
          v-on:click="deleteFiles"
        >
          <IconDelete
            aria-hidden="true"
            class="mr-2"
          ></IconDelete>
          Delete selected files
        </button>

        <form
          role="search"
          class="w-full max-w-xs ml-auto relative"
          v-on:submit.prevent="filterFiles"
        >
          <span
            aria-hidden="true"
            class="absolute h-full right-3 flex items-center pointer-events-none"
          >
            <IconSearch class=""></IconSearch>
          </span>

          <input
            v-model="filterValue"
            type="search"
            class="mt-0 pr-11"
            placeholder="Filter displayed files..."
            aria-label="Filter displayed files..."
            v-on:search="
              () => {
                // Event fired when searching or clicking on the 'x'
                if (!filterValue) {
                  resetFilter()
                  return
                }
              }
            "
          />
        </form>
      </div>

      <ul class="mt-5 grid grid-cols-3 gap-5">
        <li
          v-for="file in filesToDisplay"
          :key="`content-file-${file.path}`"
          class="flex items-center"
        >
          <label
            :for="`file-${file.path}`"
            class="sr-only"
          >
            Add file named "{{ file.file_title }}" to selection
          </label>

          <input
            :id="`file-${file.path}`"
            type="checkbox"
            class="mr-2"
            v-on:change="
              ({ target }) => {
                if ((target as HTMLInputElement).checked) {
                  selectedFiles.push(file)
                } else {
                  selectedFiles = selectedFiles.filter(selectedFile => selectedFile.path !== file.path)
                }
              }
            "
          />

          <router-link
            :to="`/content-type/${contentTypeName}/file?path=${file.path}`"
            class="capitalize w-full flex items-center bg-neutral hover:bg-neutral-focus p-3 rounded-md transition-colors"
          >
            <span class="sr-only">Edit the file named </span>

            {{ file.file_title }}

            <IconArrowRight
              class="ml-auto"
              aria-hidden="true"
            ></IconArrowRight
          ></router-link>
        </li>
      </ul>
    </template>
  </div>
</template>
