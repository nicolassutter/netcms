<script setup lang="ts">
import { listContent } from '#src/modules/api'
// import { config } from '#src/modules/config'
import { parse } from 'path-browserify'
import type { File } from '#types/index'
import IconAdd from '~icons/carbon/add'

defineComponent({
  name: 'IndexPage',
})

const router = useRouter()
const route = useRoute()
const contentTypeName = computed(() => route.params.contentType)
const isLoading = ref(false)

const files = ref<File[]>()

// const contentType = computed(() => {
//   return config.content_types?.find(
//     (content) => content.name === contentTypeName,
//   )
// })

function getFileTitle(item: File) {
  const parsedName = parse(item.name)
  return `${parsedName.name}`
}

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
    files.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  init()
})

watch(contentTypeName, () => {
  init()
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

      <router-link
        class="btn mt-5 bg-primary hover:bg-primary-focus w-max"
        :to="`/content-type/${contentTypeName}/file/new`"
      >
        <IconAdd class="mr-2"></IconAdd>
        Create new "{{ contentTypeName }}"
      </router-link>

      <ul class="mt-5 grid grid-cols-3">
        <li
          v-for="file in files ?? []"
          :key="`content-file-${file.sha}`"
        >
          <router-link
            :to="`/content-type/${contentTypeName}/file?path=${file.path}`"
            class="capitalize block w-full bg-neutral hover:bg-neutral-focus p-3 rounded-md transition-colors"
            >{{ getFileTitle(file) }}</router-link
          >
        </li>
      </ul>
    </template>
  </div>
</template>
