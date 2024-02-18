/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        // sm: "2rem",
        // lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      backgroundImage: {
        soundwave: "url('/img/background/soundwave.png')",
        filmstrip: "url('/img/background/filmstrip.png')",
      },
      fontFamily: {
        sans: [
          '"Open Sans Variable"',
          '"Open Sans"',
          ...defaultTheme.fontFamily.sans,
        ],
        alternate: [
          '"Source Sans 3 Variable"',
          '"Source Sans 3"',
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("autoprefixer"),
  ],
};
