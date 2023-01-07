import { theme } from './src/themes/catppuccin-macchiato'
import { type Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts,js,tsx,jsx}'],
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
  plugins: [],
} satisfies Config
