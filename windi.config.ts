import { defineConfig } from 'windicss/helpers'
import typographyPlugin from 'windicss/plugin/typography'
import { theme } from './src/themes/catppuccin-macchiato'

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
      colors: {
        ...theme.colors,
      },
    },
  },
  plugins: [typographyPlugin()],
})
