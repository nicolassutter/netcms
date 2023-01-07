import { type Config } from 'tailwindcss'

export function defineTheme<T extends Config['theme']>(theme: T) {
  return theme
}
