import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        blush: "#fdf0f2",
        "blush-deep": "#f5e0e4",
        rose: {
          DEFAULT: "#e07a8a",
          deep: "#c94d64",
          dark: "#a63a4f",
        },
        gold: {
          DEFAULT: "#c9a05a",
          light: "#dfc28a",
          dark: "#a8843a",
        },
        ink: {
          DEFAULT: "#2a1f21",
          soft: "#6e5a5d",
          muted: "#9a8689",
        },
        cream: "#fffaf8",
        dark: "#1a1314",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "'Cormorant Garamond'", "serif"],
        body: ["var(--font-poppins)", "'Poppins'", "sans-serif"],
      },
      borderRadius: {
        sm: "12px",
        md: "20px",
        lg: "28px",
        xl: "36px",
      },
      boxShadow: {
        card: "0 20px 40px -18px rgba(42, 31, 33, .18)",
        hover: "0 28px 56px -22px rgba(42, 31, 33, .28)",
      },
    },
  },
  plugins: [],
};

export default config;
