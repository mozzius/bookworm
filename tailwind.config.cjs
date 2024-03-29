// eslint-disable-next-line @typescript-eslint/no-var-requires
const theme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
