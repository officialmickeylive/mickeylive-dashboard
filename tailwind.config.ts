import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-cyan": "#00F5FF",
        "neon-purple": "#BF00FF",
        "neon-gold": "#FFD700",
        "neon-green": "#00FF88",
        "neon-red": "#FF003C",
        "dark-bg": "#050814",
        "card-bg": "#0D1117",
        "card-border": "#1C2333",
        glass: "rgba(255,255,255,0.04)",
      },
      boxShadow: {
        "neon-cyan": "0 0 10px #00F5FF, 0 0 20px #00F5FF",
        "neon-purple": "0 0 10px #BF00FF, 0 0 20px #BF00FF",
        "neon-gold": "0 0 10px #FFD700, 0 0 20px #FFD700",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flicker": "flicker 1.5s infinite alternate",
      },
      keyframes: {
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": {
            opacity: "1",
          },
          "20%, 22%, 24%, 55%": {
            opacity: "0.5",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
