/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "main-background": "#f0eeed",
      border: "#dcdcdc",

      primary: "#f9f7f3",
      secondary: "#f9f7f3",

      text: "#605e5c",
      "header-text": "rgb(17, 32, 53)",
    },
    fontFamily: {
      rubik: ["Rubik", "sans-serif"],
      body: ["Rubik", "sans-serif"],
      heading: ["Source Serif Pro", "serif"],
      quote: ["Nanum Myeongjo", "serif"],
    },
    extend: {
      spacing: {
        "5": "0.313rem",
        "10": "0.625rem",
        "15": "0.938rem",
        "20": "1.25rem",
        "40": "2.5rem",
      },
    },
  },
  plugins: [],
};
