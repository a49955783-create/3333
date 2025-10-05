/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",     // ✅ لدعم نظام app
    "./pages/**/*.{js,ts,jsx,tsx}",   // ✅ لو استعملت pages
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0a0f1a",
        policeBlue: "#1b2a41",
        accent: "#6b5bff",
      },
    },
  },
  plugins: [],
};
