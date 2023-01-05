import { init, defineConfig } from './lib'

const config = defineConfig({
  committer: {
    email: 'netcms@email.com',
    name: 'netcms',
  },
})

init(config)
