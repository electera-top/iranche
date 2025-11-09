import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IRANYekanWeb', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          950: 'var(--primary-950)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          50: 'var(--secondary-50)',
          100: 'var(--secondary-100)',
          200: 'var(--secondary-200)',
          300: 'var(--secondary-300)',
          400: 'var(--secondary-400)',
          500: 'var(--secondary-500)',
          600: 'var(--secondary-600)',
          700: 'var(--secondary-700)',
          800: 'var(--secondary-800)',
          900: 'var(--secondary-900)',
          950: 'var(--secondary-950)',
        },
        white: "#FFFFFF",
        highlight: 'var(--secondary)'
      },
      borderRadius: {
        DEFAULT: '0.5rem',      // 8px
        'sm': '0.25rem',        // 4px
        'md': '0.5rem',         // 8px
        'lg': '0.75rem',        // 12px
        'xl': '1rem',           // 16px
      },
    
    },
  },
  // تنظیمات نسخه 4 تیلویند
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    // @ts-expect-error - Fix for TypeScript error
    ({ addComponents }) => {
      addComponents({
        '.container': {
          maxWidth: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          '@screen sm': {
            maxWidth: '600px',
          },
          '@screen md': {
            maxWidth: '728px',
          },
          '@screen lg': {
            maxWidth: '984px',
          },
          '@screen xl': {
            maxWidth: '1200px',
          },
          '@screen 2xl': {
            maxWidth: '1536px',
          },
        },
      });
    },
    // Add scrollbar-hide utility class
    // @ts-expect-error - Fix for TypeScript error
    ({ addUtilities }) => {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* IE and Edge */
          '-ms-overflow-style': 'none',
        },
      });
    },
  ],
}

export default config