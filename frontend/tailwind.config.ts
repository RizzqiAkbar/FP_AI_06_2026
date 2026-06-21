import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        page: '#f7faf4',
        'green-dark': '#27500A',
        'green-primary': '#639922',
        'green-fill': '#EAF3DE',
        'green-border': '#C0DD97',
        'green-border-light': '#d4e8c2',
        'text-muted': '#5F5E5A',
        'text-muted-dark': '#444441',
        card: '#ffffff',
      },
      borderRadius: {
        card: '14px',
        btn: '10px',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      boxShadow: {
        card: '0 1px 6px 0 rgba(39, 80, 10, 0.06)',
        'card-hover': '0 4px 20px 0 rgba(39, 80, 10, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
