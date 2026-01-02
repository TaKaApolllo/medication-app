import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        // 高齢者向けに大きめのフォントサイズを設定
        'xl': '1.5rem',    // 24px
        '2xl': '1.875rem', // 30px
        '3xl': '2.25rem',  // 36px
        '4xl': '3rem',     // 48px
      },
    },
  },
  plugins: [],
};
export default config;
