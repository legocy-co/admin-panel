/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{html,ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontSize: {
        'bh': '2.5rem',
      },
      colors: {
        'slate': '#3C3A3A',
        'charcoal': '#2C2828',
        'rose': '#FFD0D0',
        'legocy': '#FFD540',
        'legocy-hover': '#f5cc3c',
        'legocy-active': '#ecc439',
        'rose-2': '#FFD0D0D1',
        'burgundy': '#821919',
        'graphite': '#414141AD',
        'silver': '#C4C4C4',
        'light': '#5F5F5F',
        'ghost': '#F8F8F8',
        'dark': '#2f2f2f',
      },
      gridTemplateColumns: {
        'auto-1fr': 'auto 1fr',
      },
    },
  },
  plugins: [],
}

