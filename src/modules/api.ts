import { router } from '#src/router'
import { useNotificationsStore } from '#src/stores/notificationsStore'
import { appendSlash, call } from '#src/utils/utils'
import type {
  CreateFileResponse,
  GithubFile,
  SingleFile,
  Commit,
} from '#types/index'
import { $fetch } from 'ohmyfetch'
import { netlifyIdentity } from './auth'
import { config, extensions } from './config'

class API {
  public $fetch

  public constructor(private defaultHeaders?: Record<string, string>) {
    this.$fetch = $fetch.create({
      baseURL: `https://elegant-muffin-ddcbaa.netlify.app/.netlify`,
      headers: this.defaultHeaders ?? {},
      async onResponseError({ response }) {
        // Netlify error when it cannot communicate with Github API.
        // The user needs to relog to fix it.
        const isSessionError =
          response.status === 400 &&
          response._data?.msg === 'Operator microservice headers missing'

        if (isSessionError) {
          const notificationsStore = useNotificationsStore()
          await netlifyIdentity.logout()

          router.push('/')

          notificationsStore.add({
            content: 'Your session needs to be refreshed, please log back in.',
            status: 'error',
          })

          notificationsStore.$dispose()
        }
      },
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
  isAlreadyBase64?: boolean
}) {
  return await authenticatedApi.$fetch<CreateFileResponse>(
    `/git/github/contents${appendSlash(options.path)}`,
    {
      method: 'PUT',
      body: {
        message: options.message,
        committer: config.committer,
        content: options.isAlreadyBase64
          ? options.content
          : btoa(options.content),
      },
    },
  )
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
  return await authenticatedApi.$fetch<CreateFileResponse>(
    `/git/github/contents${appendSlash(options.path)}`,
    {
      method: 'PUT',
      body: {
        message: options.message,
        committer: config.committer,
        content: btoa(options.content),
        sha: options.sha,
      },
    },
  )
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
  await authenticatedApi.$fetch(
    `/git/github/contents${appendSlash(options.path)}`,
    {
      method: 'DELETE',
      body: {
        message: options.message,
        committer: config.committer,
        sha: options.sha,
      },
    },
  )
}

/**
 * Get the content of the file at the given path
 */
export async function readFile(path: string) {
  return await authenticatedApi.$fetch<SingleFile>(
    `/git/github/contents${appendSlash(path)}`,
    {
      method: 'GET',
    },
  )
}

/**
 * Gets all the available assets
 */
export async function listAssets() {
  const assets_dir = config.assets_dir ?? 'assets'

  const files = await call(async () => {
    try {
      return (
        (await authenticatedApi.$fetch<GithubFile[]>(
          `/git/github/contents${appendSlash(assets_dir)}`,
          {
            method: 'GET',
            params: {
              // Hack to disable cache
              d: new Date().getTime(),
            },
          },
        )) ?? []
      )
    } catch (error) {
      throw new Error('EASSETS404')
    }
  })

  return files
}

/**
 * Gets all the available content for the given contentType
 */
export async function listContent(contentType: string) {
  const content_dir = `${config.content_dir}/${contentType}`

  if (!config.content_types?.find((type) => type.name === contentType)) {
    throw new Error('ECT404-1')
  }

  const files = await call(async () => {
    try {
      return (
        (await authenticatedApi.$fetch<GithubFile[]>(
          `/git/github/contents${appendSlash(content_dir)}`,
          {
            method: 'GET',
            params: {
              // Hack to disable cache
              d: new Date().getTime(),
            },
          },
        )) ?? []
      )
    } catch (error) {
      throw new Error('ECT404')
    }
  })

  return files.filter((file) => {
    return !!extensions.find((ext) => file.path.endsWith(`.${ext}`))
  })
}

/**
 * Gets the latest commits
 */
export async function listCommits() {
  const commits = await authenticatedApi.$fetch<Commit[]>(
    `/git/github/commits`,
    {
      method: 'GET',
      params: {
        // Hack to disable cache
        d: new Date().getTime(),
        per_page: 10,
      },
    },
  )

  return commits
}
