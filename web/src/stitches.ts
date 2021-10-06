import * as Stitches from "@stitches/solid";
import * as colors from "@radix-ui/colors";

export const { getCssText, css, config, styled } = Stitches.createStitches({
  media: {
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
    "2xl": "(min-width: 1536px)",
  },
  theme: {
    fonts: {
      primary: "Work Sans, -apple-system, system-ui, sans-serif",
    },
    colors: {
      textPrimary: "#11181c",
      textSecondary: "#687076",
      ...colors.blue,
      ...colors.green,
      ...colors.red,
      ...colors.gray,
      ...colors.slate,
    },
    space: {
      "1": "5px",
      "2": "10px",
      "3": "15px",
      "4": "20px",
      "5": "25px",
      "6": "35px",
      "7": "45px",
      "8": "65px",
    },
    fontSizes: {
      "1": "12px",
      "2": "13px",
      "3": "15px",
      "4": "17px",
      "5": "19px",
      "6": "21px",
      "7": "27px",
      "8": "35px",
      "9": "45px",
    },
  },
});
