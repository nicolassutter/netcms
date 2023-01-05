import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Pages from 'vite-plugin-pages'
import Icons from 'unplugin-icons/vite'
import path from 'node:path'
import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '#types',
        replacement: path.resolve(__dirname, 'types'),
      },
      {
        find: '#src',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  plugins: [
    vue(),
    Icons({
      autoInstall: true,
    }),
    AutoImport({
      imports: ['vue', 'pinia'],
      dirs: ['./src/composables'],
    }),
    Pages({
      dirs: 'src/pages',
    }),
    WindiCSS(),
  ],
})
