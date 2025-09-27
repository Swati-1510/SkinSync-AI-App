/** @type {import('tailwindcss').Config} */
const { colors } = require('./constants/theme.js');
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontSize: {
        '24px': '24px', 
      },
      fontFamily: {
        'nunito-sans-regular': ['NunitoSans_400Regular'],
        'nunito-sans-bold': ['NunitoSans_700Bold'],
        'playfair-display-regular': ['PlayfairDisplay_400Regular'],
      },
      colors: {
        ...colors,
      },
    },
  },
  plugins: [],
}

