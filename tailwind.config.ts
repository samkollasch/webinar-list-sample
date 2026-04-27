import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#00B140",
          tertiary: "#E7E7E7",
        },
      },
    },
  },
  plugins: [],
};

export default config;
