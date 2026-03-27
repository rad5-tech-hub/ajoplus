import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          500: '#0a84ff', 
          600: '#0066cc',
        },
        success: '#22c55e', // Ajo green
        naira: '#00c853',
      },
      fontFamily: {
        sans: ['Inter', 'system_ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;