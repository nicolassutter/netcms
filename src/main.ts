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
      ],
    },
    {
      name: 'project',
      format: 'json',
      title_field: 'project_name',
      fields: [
        {
          name: 'project_name',
          type: 'text',
          label: 'Project name',
          params: {},
        },
        {
          name: 'project_body',
          type: 'rich',
          label: 'Project body',
          params: {},
        },
        {
          name: 'project_technologies',
          type: 'select',
          label: 'Project technologies',
          params: {
            options: [
              {
                label: 'Vue',
                value: 'vue',
              },
              {
                label: 'React',
                value: 'react',
              },
              {
                label: 'Svelte',
                value: 'svelte',
              },
            ],
          },
        },
      ],
    },
    {
      name: 'thing',
      title_field: 'thing1',
      format: 'md',
      fields: [
        {
          name: 'thing1',
          label: 'The thing',
          type: 'text',
          params: {},
        },
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
