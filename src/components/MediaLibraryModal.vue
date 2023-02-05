<script setup lang="ts">
import { createFile, listAssets } from '#src/modules/api'
import { config } from '#src/modules/config'
import { useNotificationsStore } from '#src/stores/notificationsStore'
import type { GithubFile } from '#types/schemas'
import { join } from 'path-browserify'
import IconClose from '~icons/carbon/close'
import IconDocument from '~icons/carbon/document'

const notificationsStore = useNotificationsStore()
const uid = uuid()

const assets = ref<GithubFile[]>([])

const isLoading = ref(true)

withDefaults(
  defineProps<{
    /** @default true */
    multiple: boolean
  }>(),
  {
    multiple: true,
  },
)

const emit = defineEmits<{
  (e: 'submit', assets: GithubFile[]): void
  (e: 'close'): void
}>()

const selectedAssets = ref<GithubFile[]>([])

async function init() {
  isLoading.value = true

  try {
    const fetchedAssets = await listAssets()
    assets.value = fetchedAssets
  } catch (error) {
    if (error instanceof Error && error.message === 'EASSETS404') {
      notificationsStore.add({
        content: 'The assets directory does not exist, it will be created.',
        status: 'warning',
      })
    }
  } finally {
    isLoading.value = false
  }
}

function isImg(asset: GithubFile) {
  return ['.jpeg', '.jpg', '.png', '.ico', '.svg'].some((ext) =>
    asset.name.includes(ext),
  )
}

async function uploadAsset(asset: File) {
  const reader = new FileReader()
  reader.readAsDataURL(asset)

  const base64AssetContent = await new Promise<string>((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
  })

  const { content } = await createFile({
    content: base64AssetContent.replace(/^data:\w+\/\w+;base64,/m, ''),
    message: `chore: add asset "${asset.name}"`,
    path: join(config.assets_dir ?? 'assets', asset.name),
    isAlreadyBase64: true,
  })

  return content
}

function submit() {
  emit('submit', selectedAssets.value)
}

async function handleFile(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files && target.files[0]

  if (file) {
    notificationsStore.add({
      content: 'File uploading...',
      status: 'info',
    })

    isLoading.value = true

    try {
      await uploadAsset(file)
      await init()

      notificationsStore.add({
        content: 'File successfully uploaded',
        status: 'success',
      })
    } catch (error) {
      notificationsStore.add({
        content: 'File could not be uploaded',
        status: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="shadow-lg rounded-md p-5 max-w-3xl w-full bg-base relative">
    <button
      type="button"
      class="btn hover:bg-neutral absolute top-5 right-5"
      aria-label="Close"
      v-on:click="$emit('close')"
    >
      <IconClose class="w-6 h-6"></IconClose>
    </button>

    <h1 class="text-xl font-bold mb-5">Assets</h1>

    <p v-if="isLoading">Loading...</p>

    <form
      v-else
      v-on:submit.prevent="submit"
    >
      <div class="grid grid-cols-4 gap-2">
        <article
          v-for="asset in assets"
          :key="`asset-${asset.path}`"
          class="flex gap-2 bg-neutral p-2 rounded-md"
        >
          <div>
            <label
              :for="`asset-input-${asset.name}`"
              class="sr-only"
              >Select asset {{ asset.name }}</label
            >

            <input
              :id="`asset-input-${asset.name}`"
              :type="multiple ? 'checkbox' : 'radio'"
              :name="multiple ? undefined : 'asset-input'"
              class="mt-0"
              v-on:change="
              (event) => {
                if ((event.target as HTMLInputElement).checked) {
                  multiple
                    ? selectedAssets.push(asset)
                    : selectedAssets[0] = asset
                } else {
                  selectedAssets = selectedAssets.filter(
                    (a) => a.path !== asset.path,
                  )
                }
              }
            "
            />
          </div>

          <div>
            <h2 class="mb-2">{{ asset.name }}</h2>

            <template v-if="isImg(asset)">
              <img
                :src="asset.download_url"
                class="rounded-md"
                alt=""
              />
            </template>

            <template v-else>
              <div
                class="bg-base-100 rounded-md p-5 flex items-center justify-center"
              >
                <IconDocument class="w-10 h-10"></IconDocument>
              </div>
            </template>
          </div>
        </article>
      </div>

      <label
        class="mt-5"
        :for="`file-upload-${uid}`"
        >Upload a new asset</label
      >

      <input
        :id="`file-upload-${uid}`"
        type="file"
        v-on:change="handleFile"
      />

      <div class="flex gap-3">
        <button
          type="submit"
          class="btn btn-primary mt-5"
          :disabled="selectedAssets.length === 0"
        >
          Submit file selection
        </button>

        <button
          type="button"
          class="btn btn-secondary mt-5"
          v-on:click="$emit('close')"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
