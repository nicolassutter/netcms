import { useUserStore } from '#src/stores/userStore'
import { $fetch } from 'ohmyfetch'

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

  if (user) {
    await $fetch(
      `https://elegant-muffin-ddcbaa.netlify.app/.netlify/git/github/contents${options.path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token.access_token}`,
        },
        body: {
          message: options.message,
          committer: {
            name: 'LoggedIn user',
            email: 'fakeuser@email.com',
          },
          content: btoa(options.content),
        },
      },
    )
  }
}
