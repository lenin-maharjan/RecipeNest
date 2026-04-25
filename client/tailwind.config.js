/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#FFFCF5',
        paprika:   '#B5451B',
        peach:     '#FDE8D5',
        saffron:   '#F5C842',
        herb:      '#3A6B4A',
        linen:     '#EBE3D5',
        sand:      '#C4B8A8',
        warm1:     '#FAEBC0',
        warm2:     '#FDE8D5',
        warm3:     '#E4EFE7',
        warm4:     '#F0E8F0',
        warm5:     '#E8EEF5',
      },
      fontFamily: {
        heading: ['Georgia', 'Times New Roman', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '3px', md: '6px', lg: '10px', xl: '12px',
      },
    },
  },
  plugins: [],
};