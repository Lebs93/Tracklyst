/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0052CC",
        secondary: "#3399FF",
        "neutral-light": "#F4F6F8",
        "neutral-dark": "#2E2E2E",
      },
      backgroundImage: {
        "sidebar-pattern": "url('/textures/sidebar-pattern.svg')",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.05)",
      },
      borderRadius: {
        lg: "0.75rem",
      },
    },
  },
  plugins: [],
};
