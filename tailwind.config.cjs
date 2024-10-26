/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // fontSize: {
      //   "2xl": ["2.5vw", "2.5rem"],
      //   "3xl": ["3vw", "3rem"],
      //   "4xl": ["4vw", "4rem"],
      //   "5xl": ["5vw", "5rem"],
      //   "6xl": ["6vw", "6rem"],
      // },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
