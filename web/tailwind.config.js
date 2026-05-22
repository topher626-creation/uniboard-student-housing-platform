/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563EB',
          700: '#1E40AF',
          900: '#0F172A',
        },
        market: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          600: '#10B981',
          700: '#047857',
        },
        action: {
          100: '#FED7AA',
          500: '#F97316',
          600: '#EA580C',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 47, 87, 0.10)',
      },
    },
  },
  plugins: [],
};
