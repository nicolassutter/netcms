import { z } from 'zod'

/*
 * To add a new field type:
 * 1. Define its name in `FieldTypeSchema`
 * 2. Create its schema (could take another and modify it)
 * 3. Add the schema to `AnyFieldSchema`
 * 4. Finally, add it to `fieldsMap`
 */

export const FormatSchema = z.enum(['json', 'yml', 'md'])

export const FieldTypeSchema = z.enum([
  'text',
  'email',
  'select',
  'rich',
  'media',
  'check',
])

export const FieldSchema = z.object({
  label: z.string().optional(),
  name: z.string(),
})

export const SelectOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
})

export const CheckFieldSchema = z
  .object({
    params: z.object({}).optional(),
    default: z.boolean({}).default(false),
    type: z.literal('check' satisfies FieldType),
  })
  .merge(FieldSchema)

export const TextFieldSchema = z
  .object({
    params: z.object({}).optional(),
    default: z.string().default(''),
    type: z.literal('text' satisfies FieldType),
  })
  .merge(FieldSchema)

export const EmailFieldSchema = z
  .object({
    params: z.object({}).optional(),
    default: z.string().default(''),
    type: z.literal('email' satisfies FieldType),
  })
  .merge(FieldSchema)

export const RichFieldSchema = z
  .object({
    params: z.object({}).optional(),
    default: z.string().default(''),
    type: z.literal('rich' satisfies FieldType),
  })
  .merge(FieldSchema)

export const MediaFieldSchema = z
  .object({
    params: z.object({
      accept: z.array(z.string()),
    }),
    type: z.literal('media' satisfies FieldType),
  })
  .merge(FieldSchema)

export const SelectFieldSchema = z
  .object({
    params: z.object({
      options: z.array(SelectOptionSchema),
      multiple: z.boolean().default(false),
    }),
    default: z.string().default(''),
    type: z.literal('select' satisfies FieldType),
  })
  .merge(FieldSchema)

/**
 * @see https://zod.dev/?id=discriminated-unions
 */
export const AnyFieldSchema = z.discriminatedUnion('type', [
  TextFieldSchema,
  EmailFieldSchema,
  SelectFieldSchema,
  RichFieldSchema,
  MediaFieldSchema,
  CheckFieldSchema,
])

const ContentTypeSchema = z.object({
  name: z.string(),
  format: FormatSchema,
  fields: z.array(AnyFieldSchema),
  /**
   * The `name` of the field that will be used as a single entity's title
   *
   * For a "post" content type, a post has a `title` field (the title of the post).
   * We could therefore set `title_field: title`, that way each post will use the `title` field as their identifier
   */
  title_field: z.string(),
})

export const HookSchema = z.object({
  name: z.string(),
  url: z.string(),
  description: z.string().optional(),
})

export const ConfigSchema = z.object({
  committer: z.object({
    email: z.string(),
    name: z.string(),
  }),
  content_dir: z.string(),
  site_url: z.string().optional(),
  assets_dir: z.string(),
  content_types: z.array(ContentTypeSchema),
  hooks: z.array(HookSchema).optional(),
})

export type Format = z.input<typeof FormatSchema>
export type FieldType = z.input<typeof FieldTypeSchema>
export type SelectOption = z.input<typeof SelectOptionSchema>
export type TextField = z.input<typeof TextFieldSchema>
export type EmailField = z.input<typeof EmailFieldSchema>
export type CheckField = z.input<typeof CheckFieldSchema>
export type SelectField = z.input<typeof SelectFieldSchema>
export type RichField = z.input<typeof RichFieldSchema>
export type MediaField = z.input<typeof MediaFieldSchema>
export type AnyField = z.input<typeof AnyFieldSchema>

export type ContentType = z.input<typeof ContentTypeSchema>
export type Hook = z.input<typeof HookSchema>
export type Config = z.input<typeof ConfigSchema>

export type FieldsMap = {
  [K in keyof typeof fieldsMap]: z.input<(typeof fieldsMap)[K]>
}

export const fieldsMap = {
  text: TextFieldSchema,
  email: EmailFieldSchema,
  select: SelectFieldSchema,
  rich: RichFieldSchema,
  media: MediaFieldSchema,
  check: CheckFieldSchema,
} satisfies Record<FieldType, unknown>
