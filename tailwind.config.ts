/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    colors: {
      "main-background": "#f0eeed",
      border: "#dcdcdc",

      primary: "#e45f4b",
      secondary: "#f9f7f3",

      text: "#605e5c",
      "header-text": "rgb(17, 32, 53)",

      tag: "#d1cdcb",
      tagText: "rgba(0,0,0,.5)",
      tagActive: "#F2CB3D",
      tagInactive: "#d1cdcb",
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
        none: "0",
        xs: "0.313rem",
        sm: "0.625rem",
        md: "0.938rem",
        lg: "1.25rem",
        xl: "2.5rem",
      },
      borderRadius: {
        sm: "0.313rem",
      },
      fontSize: {
        xss: ["0.65rem", "1rem"],
      },
    },
  },
  plugins: [],
};
