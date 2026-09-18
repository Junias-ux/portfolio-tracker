import type { Config } from "tailwindcss";

// Palette et typographies reprises du design validé (maquettes haute-fidélité).
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAF7",
        panel: "#FFFFFF",
        ink: "#1B1F1D",
        muted: "#5B6B63",
        green: { DEFAULT: "#1F4D3D", soft: "#E7EEEA" },
        red: { DEFAULT: "#8C3B2E", soft: "#F3E7E4" },
        line: "#D8DBD4",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["IBM Plex Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
