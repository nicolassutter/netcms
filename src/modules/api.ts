import { $fetch } from 'ohmyfetch'
import { config } from './config'

class API {
  public $fetch

  public constructor(private defaultHeaders?: Record<string, string>) {
    this.$fetch = $fetch.create({
      baseURL: `https://elegant-muffin-ddcbaa.netlify.app/.netlify`,
      headers: this.defaultHeaders ?? {},
    })
  }
}

/**
 * Used for authenticated requests to Netlify's proxy api
 */
const authenticatedApi = new API({
  get Authorization() {
    const access_token = localStorage.getItem('netlify_token')
    return `Bearer ${access_token}`
  },
})

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
  await authenticatedApi.$fetch(`/git/github/contents${options.path}`, {
    method: 'PUT',
    body: {
      message: options.message,
      committer: config.committer,
      content: btoa(options.content),
    },
  })
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
  await authenticatedApi.$fetch(`/git/github/contents${options.path}`, {
    method: 'PUT',
    body: {
      message: options.message,
      committer: config.committer,
      content: btoa(options.content),
      sha: options.sha,
    },
  })
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
  await authenticatedApi.$fetch(`/git/github/contents${options.path}`, {
    method: 'DELETE',
    body: {
      message: options.message,
      committer: config.committer,
      sha: options.sha,
    },
  })
}
