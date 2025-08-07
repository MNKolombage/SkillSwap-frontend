/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",     // Indigo Blue
        accent: "#FF8A5C",      // Coral Peach
        lavender: "#F6E6FF",    // Lavender Mist
        dark: "#2C2C2C",        // Charcoal Text
        light: "#FAFAFA",       // Background
      },
    },
  },
  plugins: [],
}
