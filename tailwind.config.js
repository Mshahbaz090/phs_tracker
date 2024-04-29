/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fcfcfc: "#fcfcfc",
        fefefe: "#fefefe",
        fdaf18: "#fdaf18",
        appColor: "#FBA834",
        // blueColor: "#669bbc",
        //  blueColor: "#0496ff",
        blueColor: "#FBA834",
        //blueColor: "#fdb015",
        // blueColor: "#9ca3af",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#FBA834",

          secondary: "#007aac",

          accent: "#00e0ff",

          neutral: "#030600",

          "base-100": "#ffffff",

          info: "#00f5ff",

          success: "#00f893",

          warning: "#f29a00",

          error: "#e94e59",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
