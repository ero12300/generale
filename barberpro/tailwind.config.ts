import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0b",
          soft: "#111114",
          card: "#16161a",
          line: "#26262c",
        },
        gold: {
          DEFAULT: "#c9a227",
          soft: "#e4c76a",
          bright: "#f2d98a",
          deep: "#8a6f18",
        },
        cream: "#f5f1e6",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 10px 40px -12px rgba(201, 162, 39, 0.45)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #f2d98a 0%, #c9a227 45%, #8a6f18 100%)",
        "ink-radial": "radial-gradient(1200px 600px at 50% -10%, rgba(201,162,39,0.12), transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
