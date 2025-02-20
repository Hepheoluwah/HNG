module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#1E3A8A", // Deep Blue
          "secondary": "#475569", // Slate Gray
          "accent": "#0284C7", // Bright Blue
          "neutral": "#E2E8F0", // Light Gray
          "base-100": "#FFFFFF", // White
          "base-content": "#1F2937", // Dark Text
          "send-btn": "#0284C7",
        },
      },
      {
        dark: {
          "primary": "#1E293B", // Dark Blue-Gray
          "secondary": "#94A3B8", // Muted Slate
          "accent": "#0EA5E9", // Light Blue Accent
          "neutral": "#0F172A", // Deep Navy
          "base-100": "#1E293B", // Darker Background
          "base-content": "#E2E8F0", // Light Text
          "send-btn": "#0284C7",
        },
      },
    ],
  },
};
