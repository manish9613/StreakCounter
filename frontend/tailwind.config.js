/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: "#0B0E1A",
          soft: "#131829",
          panel: "#1C2238",
        },
        ember: {
          DEFAULT: "#FF6B35",
          bright: "#FFB347",
          dim: "#7A3B22",
        },
        lavender: "#EDEBFA",
        slatemuted: "#6B7394",
        brokenlink: "#3A4059",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        ember: "0 0 40px -8px rgba(255, 107, 53, 0.55)",
        emberSoft: "0 0 20px -6px rgba(255, 107, 53, 0.35)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.88, transform: "scale(1.03)" },
        },
        rise: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        emberFloat: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: 0 },
          "10%": { opacity: 1 },
          "90%": { opacity: 0.8 },
          "100%": { transform: "translateY(-110vh) translateX(var(--drift, 20px))", opacity: 0 },
        },
        popIn: {
          "0%": { opacity: 0, transform: "scale(0.5)" },
          "70%": { opacity: 1, transform: "scale(1.12)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        cellPop: {
          "0%": { opacity: 0, transform: "scale(0.4) translateY(4px)" },
          "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
        },
        modalIn: {
          "0%": { opacity: 0, transform: "translateY(24px) scale(0.94)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        overlayIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        ringBurst: {
          "0%": { transform: "scale(0.4)", opacity: 0.9 },
          "100%": { transform: "scale(2.6)", opacity: 0 },
        },
        sparkOut: {
          "0%": { transform: "translate(0, 0) scale(1)", opacity: 1 },
          "100%": {
            transform:
              "translate(var(--sx, 0px), var(--sy, -60px)) scale(0)",
            opacity: 0,
          },
        },
        toastIn: {
          "0%": { opacity: 0, transform: "translateY(-12px) translateX(-50%)" },
          "100%": { opacity: 1, transform: "translateY(0) translateX(-50%)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-3px)" },
          "80%": { transform: "translateX(3px)" },
        },
        countPulse: {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.18)" },
          "100%": { transform: "scale(1)" },
        },
        slideSwapLeft: {
          "0%": { opacity: 0, transform: "translateX(18px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        slideSwapRight: {
          "0%": { opacity: 0, transform: "translateX(-18px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        noteOut: {
          "0%": { opacity: 1, transform: "scale(1) translateX(0)", maxHeight: "200px" },
          "100%": { opacity: 0, transform: "scale(0.9) translateX(12px)", maxHeight: "0px" },
        },
      },
      animation: {
        flicker: "flicker 3.2s ease-in-out infinite",
        rise: "rise 0.5s ease-out both",
        emberFloat: "emberFloat linear infinite",
        popIn: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
        cellPop: "cellPop 0.35s ease-out both",
        modalIn: "modalIn 0.4s cubic-bezier(0.22,1,0.36,1) both",
        overlayIn: "overlayIn 0.25s ease-out both",
        ringBurst: "ringBurst 0.7s ease-out forwards",
        sparkOut: "sparkOut 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
        toastIn: "toastIn 0.35s cubic-bezier(0.22,1,0.36,1) both",
        shake: "shake 0.4s ease-in-out",
        countPulse: "countPulse 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        slideSwapLeft: "slideSwapLeft 0.3s ease-out both",
        slideSwapRight: "slideSwapRight 0.3s ease-out both",
        noteOut: "noteOut 0.35s ease-in forwards",
      },
    },
  },
  plugins: [],
};
