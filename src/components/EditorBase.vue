<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import IconBold from '~icons/carbon/text-bold'
import IconItalic from '~icons/carbon/text-italic'
import type { Raw } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
  }>(),
  {
    modelValue: '',
  },
)

const emit = defineEmits<(e: 'update:modelValue', content: string) => void>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML() as string)
  },
})

watch(
  () => props.modelValue,
  (value) => {
    // HTML
    const isSame = editor.value?.getHTML() === value

    if (isSame) {
      return
    }

    editor.value?.commands.setContent(value, false)
  },
)

type Tool = {
  title: string
  action: () => any
  active: boolean
  icon?: Raw<typeof IconBold>
  buttonContent?: string
  buttonClasses?: any
}

const tools = computed<Tool[]>(() => [
  ...Array.from({ length: 4 }).map((_, index) => ({
    title: `Heading ${index + 1}`,
    action: () =>
      editor.value
        ?.chain()
        .focus()
        .toggleHeading({
          level: (index + 1) as 1 | 2 | 3 | 4,
        })
        .run(),
    active: Boolean(
      editor.value?.isActive('heading', {
        level: (index + 1) as 1 | 2 | 3 | 4,
      }),
    ),
    buttonContent: `H${index + 1}`,
    buttonClasses: 'font-bold',
  })),
  {
    title: 'Bold',
    action: () => editor.value?.chain().focus().toggleBold().run(),
    active: Boolean(editor.value?.isActive('bold')),
    icon: markRaw(IconBold),
  },
  {
    title: 'Italic',
    action: () => editor.value?.chain().focus().toggleItalic().run(),
    active: Boolean(editor.value?.isActive('italic')),
    icon: markRaw(IconItalic),
  },
])
</script>

<template>
  <div
    v-if="editor"
    class="editor mt-2"
  >
    <div class="menu flex items-center gap-2">
      <button
        v-for="tool in tools"
        :key="`tool-${tool.title}`"
        :class="[{ 'text-accent': tool.active }, tool.buttonClasses]"
        class="w-6 h-6 leading-6"
        :title="tool.title"
        v-on:click="tool.action"
      >
        <component
          v-if="tool.icon"
          :is="tool.icon"
          class="w-full h-full"
        ></component>

        <template v-else-if="tool.buttonContent">
          {{ tool.buttonContent }}
        </template>
      </button>
    </div>

    <editor-content :editor="editor" />
  </div>
</template>
