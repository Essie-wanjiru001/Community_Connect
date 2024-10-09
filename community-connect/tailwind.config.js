module.exports = {
  // use content instead of purge if using tailiwind v3
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",

    // this line fixed the issue for me
    "./node_modules/{component-library-name}/src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
};