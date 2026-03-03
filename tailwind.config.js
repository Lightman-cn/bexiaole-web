/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a2b4a',
        secondary: '#4a5c7a',
        accent: '#c4a35a',
      },
      // Mobile-first responsive breakpoints
      screens: {
        // Default: mobile (0-639px)
        'sm': '640px',   // Mobile landscape / Small tablet
        'md': '768px',   // Tablet
        'lg': '1024px',  // Desktop
        'xl': '1280px',  // Large desktop
        '2xl': '1536px', // Extra large
      },
      // Minimum touch target size (44px as per WCAG)
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      // 响应式图片工具类
      aspectRatio: {
        'auto': 'auto',
        'square': '1 / 1',
        'video': '16 / 9',
        'portrait': '3 / 4',
        'wide': '21 / 9',
      },
      // 图片过渡效果
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
