/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07070b",
        surface: "#111119",
        electric: "#7c5cff",
        sky: "#4cc9f0",
        coral: "#ff6b8a"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glow: "0 0 60px rgba(124, 92, 255, 0.22)"
      },
      backgroundImage: {
        "travel-glow":
          "radial-gradient(circle at 20% 20%, rgba(76,201,240,.16), transparent 32%), radial-gradient(circle at 80% 10%, rgba(124,92,255,.2), transparent 30%), radial-gradient(circle at 60% 80%, rgba(255,107,138,.1), transparent 28%)"
      }
    }
  },
  plugins: []
};
