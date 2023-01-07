<script setup lang="ts">
import { listContent } from '#src/modules/api'
// import { config } from '#src/modules/config'
import type { File } from '#types/index'

defineComponent({
  name: 'IndexPage',
})

const router = useRouter()
const route = useRoute()
const contentType = route.params.contentType

const files = ref<File[]>()

onMounted(async () => {
  if (typeof contentType !== 'string') {
    router.push('/')
    return
  }

  const contentFiles = await listContent(contentType)
  files.value = contentFiles
})
</script>

<template>
  <div class="content-type-page">
    <h1 class="capitalize">{{ contentType }}</h1>

    <ul>
      <li
        v-for="file in files ?? []"
        :key="`content-file-${file.sha}`"
      >
        <router-link
          :to="`/content-type/${contentType}/file?path=${file.path}`"
          class="capitalize"
          >{{ file.name }}</router-link
        >
      </li>
    </ul>
  </div>
</template>
