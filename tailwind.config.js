/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Obsidian Ember design system
        background:  "#0b0c0d",
        surface:     "#0d0e0f",
        "surface-container":        "#18191a",
        "surface-container-high":   "#232526",
        "surface-container-highest":"#343535",
        "surface-container-low":    "#131415",
        "surface-container-lowest": "#0a0a0b",
        "on-surface":        "#e3e2e2",
        "on-surface-variant":"#929699",
        "outline":           "#393c3e",
        "outline-variant":   "#262829",
        primary:   "#ffffff",
        "on-primary": "#0d0e0f",
        secondary: "#ff8c42",
        "secondary-container": "#ec6a06",
        "on-secondary":        "#552100",
        ember:     "#ec6a06",
        error:     "#ff7169",
        "on-error":"#690005",
      },
      fontFamily: {
        sans: ["Geist", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        full: "9999px",
      },
      boxShadow: {
        ember: "0 0 24px rgba(236,106,6,0.25)",
        "ember-sm": "0 0 8px #ec6a06",
      },
      animation: {
        "float-slow": "float-slow 5s ease-in-out infinite",
        "float-stagger": "float-stagger 6.5s ease-in-out infinite",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float-stagger": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
