/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#32CD32',
           //DEFAULT: '#00ff73 rgb(9, 222, 105)',
          dim: 'rgba(0, 255, 115, 0.1)',
          glow: 'rgba(0, 255, 115, 0.5)',
        },
        accent: {
          yellow: '#FEDE39',
        },
        dark: {
          bg: '#0B0B0D',
          card: '#1A1A1D',
          border: '#2A2A2D',
          lighter: '#262629'
        },
        gray: {
          text: '#99A1AF',
          muted: '#4A5565',
          light: '#D1D5DC'
        },
        // Team colors from Figma
        team: {
          blue: '#5AD6FF',
          gold: '#C5BC5C',
          red: '#FF5A5D',
          purple: '#5C5EC5',
          teal: '#81A7BB',
          green: '#96D771'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at center, rgba(0, 255, 115, 0.15) 0%, rgba(11, 11, 13, 0) 70%)',
      },
      boxShadow: {

        'card': '0 4px 24px -1px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
