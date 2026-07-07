import type { Config } from "tailwindcss";

/**
 * Design tokens for Alter.
 *
 * Palette is deliberately not the two AI-cliché defaults (cream+terracotta,
 * near-black+neon): the dark surface is an indigo "vigil" tone (dusk/night
 * prayer, candlelight) rather than near-black, and the accent is a warm
 * gold ember rather than the common terracotta or acid-green.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vigil: "#191D3A", // primary dark surface — dusk sky
        dusk: "#2A2F5C", // secondary dark surface — card-on-dark
        ember: "#E8A94C", // primary accent — candlelight / hope
        clay: "#B9704A", // secondary accent — earth, used sparingly
        linen: "#F4EFE4", // warm light surface for content-dense screens
        ink: "#14162B", // near-black text on light surfaces
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-work-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "0.75rem",
      },
      keyframes: {
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.55" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(232,169,76,0.0)" },
          "35%": { boxShadow: "0 0 0 6px rgba(232,169,76,0.25)" },
        },
      },
      animation: {
        ripple: "ripple 700ms ease-out forwards",
        "pulse-glow": "pulseGlow 700ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
