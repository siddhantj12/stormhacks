import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'weather-bg': '#F6FAFF',
        'weather-accent': '#A6D0F2',
        'noir-bg': '#121316',
        'noir-text': '#EDEBE6',
        'noir-accent': '#8B0000',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      keyframes: {
        rain: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(100vh)', opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        }
      },
      animation: {
        rain: 'rain 1s linear infinite',
        ripple: 'ripple 0.6s linear',
      },
    },
  },
  plugins: [],
}
export default config
