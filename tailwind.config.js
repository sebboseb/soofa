module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      screens: {
        'phone': '300px',
        // => @media (min-width: 640px) { ... }
      },
      colors: {
        'soofa-orange': '#F59E0B',
        'letterboxd-bg': '#14181C',
        'letterboxd-navbar-bg': '#14181C',
        'youtube-white-bg': '#F9F9F9',
        'soofa-blue': '#016BA5'
      },
      height: {
        'extra-height': '500px'
      },
      transitionDuration: {
        '50': '50ms',
        '25': '25ms'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
