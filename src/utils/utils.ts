import { $fetch } from 'ohmyfetch'

export function call<T extends (...args: any[]) => any>(cb: T): ReturnType<T> {
  return cb()
}

export function entries<T extends Record<any, unknown>>(obj: T) {
  return Object.entries(obj) as [keyof T, unknown][]
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
