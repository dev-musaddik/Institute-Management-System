module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-red': '#ef4444',
        'theme-blue': '#3b82f6',
        'theme-red-dark': '#dc2626',
        'theme-blue-dark': '#2563eb',
      },
      keyframes: {
        border: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        border: "border 2s linear forwards", // runs once, from start to end
      },
    },
  },
    
  plugins: [],
};
