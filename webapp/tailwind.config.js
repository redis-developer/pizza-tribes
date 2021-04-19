module.exports = {
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Grandstander', 'sans-serif'],
    },
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      borderColor: ['disabled'],
      textColor: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
}

