import type { Config } from 'ts-json-schema-generator'
import * as tsj from 'ts-json-schema-generator'
import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import chokidar from 'chokidar'
import { debounce } from 'lodash-es'

async function generate() {
  const config: Config = {
    path: resolve(process.cwd(), 'types/index.d.ts'),
    tsconfig: resolve(process.cwd(), 'tsconfig.json'),
    type: 'ConfigSchema',
  }

  const output_path = resolve(process.cwd(), 'public/config.schema.json')
  const schema = tsj.createGenerator(config).createSchema(config.type)

  const schemaString = JSON.stringify(schema, null, 2)

  await fs.writeFile(output_path, schemaString)
}

const debouncedGenerate = debounce(generate, 50)

function start() {
  if (process.env.NODE_ENV === 'production') {
    generate()
  } else {
    chokidar.watch(resolve(process.cwd(), 'types')).on('all', () => {
      debouncedGenerate()
    })
  }
}

start()
