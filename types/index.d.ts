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
}

export type Config = {
  committer: {
    email: string
    name: string
  }
  content_dir: string
  assets_dir: string
  content_types: ContentType[]
}

export type ConfigSchema = Config & {
  $schema?: string
}
