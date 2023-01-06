import { defineConfig } from 'windicss/helpers'
import formsPlugin from 'windicss/plugin/forms'

export default defineConfig({
  darkMode: 'class',
  preflight: true,
  safelist: '',
  theme: {
    extend: {
      screens: {
        xs: '460px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [formsPlugin],
})
