export function call<T extends (...args: any[]) => any>(cb: T): ReturnType<T> {
  return cb()
}

export function entries<T extends Record<any, unknown>>(obj: T) {
  return Object.entries(obj) as [keyof T, unknown][]
}
