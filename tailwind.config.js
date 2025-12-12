/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Deep Navy (Trust & Authority)
          light: '#334155',
          dark: '#020617',
        },
        accent: {
          DEFAULT: '#3b82f6', // Medical Blue (Action)
          soft: '#dbeafe',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc', // Very light gray background
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'premium': '0 10px 40px -10px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}