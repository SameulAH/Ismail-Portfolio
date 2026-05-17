/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGreen: "#68B2A0",
        darkGreen: "#2C6975",
        lightBackground: "#F8F8F8",
        darkBackground: "#22262D",
        darkBlack: "#000000",
        grayColor: "#22262D",
        yellowColor: "FFE033",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#334155",
            "--tw-prose-headings": "#2C6975",
            "--tw-prose-links": "#2C6975",
            "--tw-prose-bold": "#1e293b",
            "--tw-prose-counters": "#68B2A0",
            "--tw-prose-bullets": "#68B2A0",
            "--tw-prose-hr": "#e2e8f0",
            "--tw-prose-quotes": "#2C6975",
            "--tw-prose-quote-borders": "#68B2A0",
            "--tw-prose-captions": "#64748b",
            "--tw-prose-code": "#2C6975",
            "--tw-prose-pre-code": "#e2e8f0",
            "--tw-prose-pre-bg": "#22262D",
            "--tw-prose-th-borders": "#cbd5e1",
            "--tw-prose-td-borders": "#e2e8f0",
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            code: {
              backgroundColor: "#e8f4f1",
              borderRadius: "0.25rem",
              paddingLeft: "0.375rem",
              paddingRight: "0.375rem",
              paddingTop: "0.125rem",
              paddingBottom: "0.125rem",
              fontWeight: "500",
            },
            a: {
              textDecorationColor: "#68B2A0",
              "&:hover": { color: "#68B2A0" },
            },
          },
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
};
