/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'Lora', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        canvas: '#FAFAF9',
        surface: '#F5F5F4',
        'surface-subtle': '#EFEFED',
        charcoal: {
          900: '#1C1917',
          800: '#292524',
          700: '#44403C',
          600: '#57534E',
          500: '#78716C',
          400: '#A8A29E',
          300: '#D6D3D1',
          200: '#E7E5E4',
          100: '#F5F5F4',
          50: '#FAFAF9',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E6ECE6',
          200: '#C7D7C7',
          300: '#9FB9A0',
          400: '#78997A',
          500: '#5F7A61',
          600: '#4D644F',
          700: '#3D4F3F',
          800: '#2D3B2F',
        },
        terracotta: {
          50: '#FCF7F5',
          100: '#F8ECE7',
          200: '#F0D4C9',
          300: '#E4B2A1',
          400: '#D68E77',
          500: '#C86D51',
          600: '#B25439',
          700: '#924029',
          800: '#753220',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
        },
        ochre: {
          50: '#FEFBE8',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
        }
      },
      boxShadow: {
        'soft-xs': '0 2px 8px 0 rgba(41, 37, 36, 0.03)',
        'soft-sm': '0 4px 16px -2px rgba(41, 37, 36, 0.04), 0 2px 6px -1px rgba(41, 37, 36, 0.02)',
        'soft-md': '0 12px 30px -4px rgba(41, 37, 36, 0.05), 0 4px 12px -2px rgba(41, 37, 36, 0.03)',
        'soft-lg': '0 20px 40px -6px rgba(41, 37, 36, 0.07), 0 8px 18px -4px rgba(41, 37, 36, 0.03)',
        'soft-xl': '0 28px 50px -8px rgba(41, 37, 36, 0.09), 0 12px 24px -6px rgba(41, 37, 36, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
