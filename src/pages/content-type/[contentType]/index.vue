<script setup lang="ts">
import { listContent } from '#src/modules/api'
// import { config } from '#src/modules/config'
import { parse } from 'path-browserify'
import type { File } from '#types/index'

defineComponent({
  name: 'IndexPage',
})

const router = useRouter()
const route = useRoute()
const contentTypeName = route.params.contentType

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

onMounted(async () => {
  if (typeof contentTypeName !== 'string') {
    router.push('/')
    return
  }

  const contentFiles = await listContent(contentTypeName)
  files.value = contentFiles
})
</script>

<template>
  <div class="content-type-page">
    <h1 class="capitalize">{{ contentTypeName }}</h1>

    <ul>
      <li
        v-for="file in files ?? []"
        :key="`content-file-${file.sha}`"
      >
        <router-link
          :to="`/content-type/${contentTypeName}/file?path=${file.path}`"
          class="capitalize"
          >{{ getFileTitle(file) }}</router-link
        >
      </li>
    </ul>
  </div>
</template>
