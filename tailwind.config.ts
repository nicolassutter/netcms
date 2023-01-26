import { theme } from './src/themes/catppuccin-macchiato'
import { type Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import type { CSSRuleObject } from 'tailwindcss/types/config'

export default {
  content: ['./index.html', './src/**/*.{vue,ts,js,tsx,jsx}'],
  theme: {
    extend: {
      screens: {
        xs: '460px',
        '3xl': '1920px',
      },
      minHeight: ({ theme }) => ({
        ...theme('spacing'),
      }),
    },
    colors: {
      ...theme.colors,
    },
  },
  plugins: [
    plugin(({ addComponents, theme }) => {
      const btns = ['primary', 'secondary', 'accent'].map((variant) => {
        return [
          `.btn-${variant}`,
          {
            'background-color': theme(`colors.${variant}`),
            color: theme(`colors.${variant}-content`),
            '&:hover': {
              'background-color': theme(`colors.${variant}-focus`),
            },
          } as CSSRuleObject,
        ]
      })

      addComponents(Object.fromEntries(btns))
    }),
  ],
} satisfies Config
