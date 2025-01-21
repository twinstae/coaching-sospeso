import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,astro}"],
  theme: {
    extend: {
      aria: {
        "current-page": 'current="page"',
      },
      spacing: {
        "icon-size": "43px",
      },
    },
  },
  daisyui: {
    themes: ["lofi"],
  },
  plugins: [daisyui],
};
