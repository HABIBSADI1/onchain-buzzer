/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // تمام فایل‌های داخل src
  ],
  theme: {
    extend: {
      colors: {
        baseBlue: '#0052FF', // رنگ برند Base
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // دستیابی با کلاس font-inter
        sans: ['Inter', 'sans-serif'],  // تنظیم پیش‌فرض برای body
      },
    },
  },
  plugins: [],
}
