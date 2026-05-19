/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0F172A",
        "slate-dark": "#334155",
        cyan: { DEFAULT: "#06B6D4" },
        blue: { DEFAULT: "#3B82F6" },
        slate: { DEFAULT: "#64748B" },
      },
    },
  },
  plugins: [],
};
