import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Pages from 'vite-plugin-pages'
import Icons from 'unplugin-icons/vite'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'
import vitePluginTailwindCSS from 'vite-plugin-tw'
import postcssImport from 'postcss-import'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib.ts'),
      formats: ['es'],
    },
  },
  resolve: {
    alias: [
      {
        find: '#types',
        replacement: resolve(__dirname, 'types'),
      },
      {
        find: '#src',
        replacement: resolve(__dirname, 'src'),
      },
    ],
  },
  css: {
    postcss: {
      plugins: [postcssImport()],
    },
  },
  plugins: [
    vue(),
    Icons({
      autoInstall: true,
    }),
    AutoImport({
      imports: [
        'vue',
        'pinia',
        'vue-router',
        {
          uuid: [['v4', 'uuid']],
        },
      ],
      dirs: ['./src/composables'],
    }),
    Pages({
      dirs: 'src/pages',
    }),
    dts({
      include: ['src/lib.ts', 'types/**/*.d.ts', '*.d.ts'],
    }),
    vitePluginTailwindCSS({
      nesting: 'postcss-nesting',
    }),
  ],
})
