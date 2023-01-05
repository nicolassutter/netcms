import { useUserStore } from '#src/stores/userStore'
import { $fetch } from 'ohmyfetch'
import { config } from './config'

/**
 * Creates a file on the repo
 *
 * @param options.path The path for the new file. e.g `/public/file.txt`
 * @param options.content The utf8 content of the file
 * @param options.message The commit message to be used
 */
export async function createFile(options: {
  path: string
  content: string
  message: string
}) {
  const { user } = useUserStore()

  if (user?.token) {
    await $fetch(
      `https://elegant-muffin-ddcbaa.netlify.app/.netlify/git/github/contents${options.path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token.access_token}`,
        },
        body: {
          message: options.message,
          committer: config.committer,
          content: btoa(options.content),
        },
      },
    )
  }
}

/**
 * Updates a file on the repo
 *
 * @param options.path The path for the new file. e.g `/public/file.txt`
 * @param options.content The utf8 content of the file
 * @param options.message The commit message to be used
 */
export async function updateFile(options: {
  path: string
  content: string
  message: string
  sha: string
}) {
  const { user } = useUserStore()

  if (user?.token) {
    await $fetch(
      `https://elegant-muffin-ddcbaa.netlify.app/.netlify/git/github/contents${options.path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token.access_token}`,
        },
        body: {
          message: options.message,
          committer: config.committer,
          content: btoa(options.content),
          sha: options.sha,
        },
      },
    )
  }
}

/**
 * Updates a file on the repo
 *
 * @param options.path The path for the new file. e.g `/public/file.txt`
 * @param options.content The utf8 content of the file
 * @param options.message The commit message to be used
 */
export async function deleteFile(options: {
  path: string
  message: string
  sha: string
}) {
  const { user } = useUserStore()

  if (user?.token) {
    await $fetch(
      `https://elegant-muffin-ddcbaa.netlify.app/.netlify/git/github/contents${options.path}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token.access_token}`,
        },
        body: {
          message: options.message,
          committer: config.committer,
          sha: options.sha,
        },
      },
    )
  }
}
