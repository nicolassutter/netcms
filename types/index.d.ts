import type { EmptyObject } from 'type-fest'

export type Format = 'json' | 'yml' | 'md'

export type FieldType = 'text' | 'email' | 'select' | 'rich' | 'media'

export type SelectOption = {
  label: string
  value: string
}

export interface TextField extends Field {
  params: EmptyObject
}

export interface EmailField extends Field {
  params: EmptyObject
}

export interface SelectField extends Field {
  params: {
    options: SelectOption[]
    /**
     * @default false
     */
    multiple?: boolean
  }
}

export interface RichField extends Field {
  params: EmptyObject
}

export interface MediaField extends Field {
  params: {
    accept?: string[]
  }
}

interface Field {
  label?: string
  name: string
  type: FieldType
}

export type AnyField =
  | MediaField
  | TextField
  | RichField
  | SelectField
  | EmailField

export type ContentType = {
  name: string
  format: Format
  fields: AnyField[]
  /**
   * The `name` of the field that will be used as a single entity's title
   *
   * For a "post" content type, a post has a `title` field (the title of the post).
   * We could therefore set `title_field: title`, that way each post will use the `title` field as their identifier
   */
  title_field: string
}

export interface Hook {
  name: string
  url: string
}

export type Config = {
  committer: {
    email: string
    name: string
  }
  content_dir: string
  site_url?: string
  assets_dir: string
  content_types: ContentType[]
  hooks?: Hook[]
}

export type ConfigSchema = Config & {
  $schema?: string
}

export interface File {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
  _links: Links
}

export interface Links {
  self: string
  git: string
  html: string
}

export interface SingleFile {
  type: string
  encoding: string
  size: number
  name: string
  path: string
  content: string
  sha: string
  url: string
  git_url: string
  html_url: string
  download_url: string
  _links: Links
}

export interface Links {
  git: string
  self: string
  html: string
}

export interface CreateFileResponse {
  content: Content
  commit: Commit
}

export interface Commit {
  sha: string
  node_id: string
  url: string
  html_url: string
  author: Author
  committer: Author
  message: string
  tree: Tree
  parents: Parent[]
  verification: Verification
}

export interface Author {
  date: string
  name: string
  email: string
}

export interface Parent {
  url: string
  html_url: string
  sha: string
}

export interface Tree {
  url: string
  sha: string
}

export interface Verification {
  verified: boolean
  reason: string
  signature: null
  payload: null
}

export interface Content {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
  _links: Links
}

export interface Links {
  self: string
  git: string
  html: string
}
