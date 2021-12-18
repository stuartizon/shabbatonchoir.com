const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      main: "#18348c",
      gray: colors.gray,
      white: colors.white,
      indigo: colors.indigo
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
