// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Existing palette (kept for backward-compat with old pages)
        primary: "#166534",
        secondary: "#c0392b",
        gold: "#c9a64a",
        textDark: "#1a1a1a",

        // Embassy-style palette
        brandNavy: "#0F2438",
        brandNavySoft: "#17344d",
        brandBlue: "#1f4e79",
        brandGold: "#d4af37",
        brandIvory: "#f7f7f4",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(16,24,40,.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
