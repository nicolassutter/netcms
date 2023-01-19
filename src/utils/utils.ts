import MarkdownIt from 'markdown-it'
import MarkdownItFrontMatter from 'markdown-it-front-matter'
import { $fetch } from 'ohmyfetch'

export function call<T extends (...args: any[]) => any>(cb: T): ReturnType<T> {
  return cb()
}

export function entries<T extends Record<any, unknown>>(obj: T) {
  return Object.entries(obj) as [keyof T, unknown][]
}

export function appendSlash(str: string) {
  return str.startsWith('/') ? str : `/${str}`
}

/**
 * Makes a Head request to know if a remote path exists or not
 */
export async function remoteExists(url: string) {
  let exists = false

  try {
    await $fetch(url, {
      method: 'Head',
      onResponse({ response }) {
        exists = response.ok
      },
    })

    return exists
  } catch (error) {
    return exists
  }
}

/**
 * Get the frontmatter in the given markdown content
 */
export function getFrontmatter(markdown: string) {
  let content = ''

  const md = MarkdownIt().use(MarkdownItFrontMatter, function (fm) {
    content = fm
  })

  md.render(markdown)
  return content
}

export const md = MarkdownIt()
