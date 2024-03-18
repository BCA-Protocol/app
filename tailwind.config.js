/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        sidebar: "300px auto", // 👈 for sidebar layout. adds grid-cols-sidebar class
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        buttonHover: "var(--color-buttons)",
        tabs: "var(--color-tabs)",
        buttons: "var(--color-buttons)",
        typography: "var(--color-typography)",
        bgprimary: "var(--color-bg-primary)",
        bgSidebar: "var(--color-bg-sidebar)",
        bgprim: "var(--color-bg-prim)",
        bgcard: "var(--color-bg-card)",

        primaryx: "var(--primary)",
        secondaryx: "var(--secondary)",
        text: "var(--text-color)",
        lightGray: "var(--light-grey)",
        white: "var(--white-color)",
        mistyRose: "var(--misty-rose)",
        lightBlueBg: "var(--light-blue-bg)",
        dimGray: "var(--dim-grey)",
        linkBgGray: "var(--link-bg-grey)",
        notificationBg: "var(--notification-bg)",
        bgGray: "var(--bg-grey)",
        backgroundBoxColor: "var(--background-box-color)",
        borderprimary: "var(--border-primary)",
      },
    },
    screens: {
      'xs': '360px',
      'sm': '640px',

      'md': '768px',

      'lg': '1024px',

      'xl': '1280px',

      '2xl': '1536px',

    }
  },
  plugins: [],
  darkMode: "class",
  plugins: [ ],
};
