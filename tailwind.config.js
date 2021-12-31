const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: {
        100: "#C2CBE8",
        200: "#8C9CD1",
        300: "#5E74BA",
        400: "#3751A3",
        500: "#18348c"
      },
      gray: colors.gray,
      white: colors.white,
      indigo: colors.indigo
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
