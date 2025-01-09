import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "custom-background": "#fffad7",
        "custom-yellow": "#f8ea8c",
        "custom-light-teal": "#a4e8e0",
        "custom-teal": "#4cd7d0",
        "custom-gold": "#e1c340",
        "custom-orange": "#f5b56c" /* Warm orange for balance */,
        "custom-light-blue": "#a4d8f8" /* Soft, airy blue */,
        "custom-blue": "#4ca7f0" /* Bright, clear blue */,
        "custom-light-pink": "#f8c9e1" /* Gentle pastel pink */,
        "custom-pink": "#f487c8" /* Vibrant pink for pop */,
        "custom-lavender": "#c7a4f8" /* Soft lavender tone */,
        "custom-light-green": "#b4e89a" /* Fresh, grassy green */,
        "custom-green": "#6cd74c" /* Bright natural green */,
        "custom-peach": "#f8d0b4" /* Subtle peach for warmth */,
        "custom-grey": "#e0e0e0" /* Neutral light grey */,
      },
    },
  },
  plugins: [],
} satisfies Config;
