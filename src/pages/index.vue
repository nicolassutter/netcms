<script setup lang="ts">
import { useUserStore } from '#src/stores/userStore'
import { useAsyncState } from '@vueuse/core'
import { listCommits } from '#src/modules/api'
import type { ValueOf } from 'type-fest'
import { merge } from 'lodash-es'

defineComponent({
  name: 'IndexPage',
})

const userStore = useUserStore()
const user = computed(() => userStore.user)
const { state: commits, isLoading: areCommitsLoading } = useAsyncState(
  listCommits(),
  [],
)

const conventionalCommitsMap = {
  fix: '🐞',
  feat: '🆕',
  chore: '⚙️',
  refactor: '⚒️',
  style: '️💅',
} as const

type ConventionalCommitEmoji = ValueOf<typeof conventionalCommitsMap>

const diplayedCommits = computed(() =>
  commits.value.map((commit) => {
    const { message } = commit.commit
    const emoji = Object.entries(conventionalCommitsMap)
      .find(([prefix]) => message.startsWith(prefix))
      ?.at(1) as ConventionalCommitEmoji | undefined

    const newMessage = emoji ? `${emoji} ${message}` : message

    return merge(commit, {
      commit: { message: newMessage },
    })
  }),
)
</script>

<template>
  <div class="index-page py-2">
    <h1 class="capitalize text-3xl font-bold">
      Hello {{ user?.user_metadata?.full_name }} 👋
    </h1>

    <h2 class="mt-5 capitalize font-bold text-xl">Latest updates</h2>

    <p v-if="areCommitsLoading">Commits loading...</p>

    <ul
      v-else
      class="mt-3 list-disc pl-5"
    >
      <li
        v-for="commit in diplayedCommits"
        :key="`commit-${commit.sha}`"
        class="mt-2"
      >
        {{ commit.commit.message }}
      </li>
    </ul>
  </div>
</template>
