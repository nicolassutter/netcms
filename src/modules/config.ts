import type { Config } from '#types/index'
import { parse } from 'yaml'
import { $fetch } from 'ohmyfetch'
import { call, remoteExists } from '#src/utils/utils'

export const config: Partial<Config> = {}

/**
 * Loads the config form the config file,
 * if it exists.
 */
export async function loadConfigFile() {
  const ymlUrl = import.meta.env.PROD
    ? '/admin/netcms.config.yml'
    : new URL('../assets/netcms.config.yml', import.meta.url).href

  const jsonUrl = import.meta.env.PROD
    ? '/admin/netcms.config.json'
    : new URL('../assets/netcms.config.json', import.meta.url).href

  const [ymlExists, jsonExists] = await Promise.all([
    call(() => remoteExists(ymlUrl)),
    call(() => remoteExists(jsonUrl)),
  ])

  /* eslint-disable prettier/prettier */
  const configUrl = ymlExists
    ? ymlUrl
    : jsonExists
      ? jsonUrl
      : undefined
  /* eslint-enable prettier/prettier */

  if (!configUrl) {
    throw new Error('failed to load config file')
  }

  const config = await $fetch(configUrl)

  // json is valid yml as well
  const finalConfig = parse(config) as Config
  return finalConfig
}
