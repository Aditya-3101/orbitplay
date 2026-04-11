// import type { Config } from "tailwindcss";
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'comment-bg': "rgb(0,0,0)"
        }
      },
    },
    plugins: [
    ],
  }