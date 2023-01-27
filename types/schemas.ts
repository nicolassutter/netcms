import { z } from 'zod'

export const FormatSchema = z.enum(['json', 'yml', 'md'])

export const FieldTypeSchema = z.enum([
  'text',
  'email',
  'select',
  'rich',
  'media',
])

export const FieldSchema = z.object({
  label: z.string().optional(),
  name: z.string(),
})

export const SelectOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
})

export const TextFieldSchema = z
  .object({
    params: z.object({}).optional(),
    default: z.string().default('').optional(),
    type: z.literal('text' satisfies FieldType),
  })
  .merge(FieldSchema)

export const EmailFieldSchema = z
  .object({
    params: z.object({}).optional(),
    default: z.string().default('').optional(),
    type: z.literal('email' satisfies FieldType),
  })
  .merge(FieldSchema)

export const RichFieldSchema = z
  .object({
    params: z.object({}).optional(),
    default: z.string().default('').optional(),
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
      multiple: z.boolean().default(false).optional(),
    }),
    default: z.string().default('').optional(),
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

export type Format = z.infer<typeof FormatSchema>
export type FieldType = z.infer<typeof FieldTypeSchema>
export type SelectOption = z.infer<typeof SelectOptionSchema>
export type TextField = z.infer<typeof TextFieldSchema>
export type EmailField = z.infer<typeof EmailFieldSchema>
export type SelectField = z.infer<typeof SelectFieldSchema>
export type RichField = z.infer<typeof RichFieldSchema>
export type MediaField = z.infer<typeof MediaFieldSchema>
export type AnyField = z.infer<typeof AnyFieldSchema>

export type ContentType = z.infer<typeof ContentTypeSchema>
export type Hook = z.infer<typeof HookSchema>
export type Config = z.infer<typeof ConfigSchema>

export type FieldsMap = {
  [K in keyof typeof fieldsMap]: z.infer<(typeof fieldsMap)[K]>
}

export const fieldsMap = {
  text: TextFieldSchema,
  email: EmailFieldSchema,
  select: SelectFieldSchema,
  rich: RichFieldSchema,
  media: MediaFieldSchema,
} satisfies Record<FieldType, unknown>
