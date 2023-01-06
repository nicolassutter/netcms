export type Config = {
  committer: {
    email: string
    name: string
  }
}

export type ConfigSchema = Config & {
  $schema?: string
}
