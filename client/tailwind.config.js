// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
  colors: {
    primary: "#1f7a1f",     // Sudan Green
    secondary: "#c0392b",   // Sudan Red
    gold: "#d4af37",        // Optional accent
    textDark: "#1a1a1a",
    },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
