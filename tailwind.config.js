module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],

  daisyui: {
    themes: [
      {
        light: {
          primary: "#f79d11",

          "primary-focus": "#dd8517",

          "primary-content": "#ffffff",

          secondary: "#2350f5",

          "secondary-focus": "#193cad",

          "secondary-content": "#ffffff",

          accent: "#00caa9",

          "accent-focus": "#2ba69a",

          "accent-content": "#ffffff",

          neutral: "#3b424e",

          "neutral-focus": "#2a2e37",

          "neutral-content": "#ffffff",

          "base-100": "#ffffff",

          "base-200": "#f9fafb",

          "base-300": "#ced3d9",

          "base-content": "#1e2734",

          info: "#1c92f2",

          success: "#009485",

          warning: "#ff9900",

          error: "#ff5724",

          "--rounded-box": "0.75rem",

          "--rounded-btn": "1rem",

          "--rounded-badge": "4rem",

          "--animation-btn": ".25s",

          "--animation-input": ".2s",

          "--btn-text-case": "default",

          "--navbar-padding": ".5rem",

          "--border-btn": "1px",
        },
      },
    ],
  },
};
