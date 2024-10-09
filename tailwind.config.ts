/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          950: "#0a0c10", // Very dark background
          900: "#1a1e2e", // Slightly lighter for cards
        },
        blue: {
          300: "#93c5fd", // Light blue for titles
          400: "#60a5fa", // Slightly darker blue for button text
          500: "#3b82f6", // Button border and hover background
        },
        green: {
          400: "#4ade80", // For the calendar icon
        },
        pink: {
          400: "#f472b6", // For the users icon
        },
        yellow: {
          400: "#facc15", // For the map pin icon
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
