import { init, defineConfig, field } from './lib'

const config = defineConfig({
  committer: {
    email: 'netcms@email.com',
    name: 'netcms',
  },
  assets_dir: 'data/assets',
  content_dir: 'data/content',
  site_url: 'https://example.com/site',
  content_types: [
    {
      name: 'post',
      format: 'yml',
      title_field: 'title',
      fields: [
        field('text', {
          name: 'title',
          label: 'Title',
          params: {},
        }),
        field('rich', {
          name: 'body',
          label: 'Post body',
          params: {},
        }),
        field('select', {
          name: 'status',
          label: 'Status',
          params: {
            options: [
              {
                label: 'Pending',
                value: 'pending',
              },
              {
                label: 'Reviewed',
                value: 'reviewed',
              },
            ],
          },
        }),
        field('check', {
          name: 'check_field',
          label: 'check field',
        }),
      ],
    },
  ],
  hooks: [
    {
      name: 'Deploy',
      url: 'https://example.com',
    },
    {
      name: 'Test',
      url: 'https://example.com/test',
    },
  ],
})

init(config)
