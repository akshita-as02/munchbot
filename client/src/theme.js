import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    purple: {
      50: "#f5e9ff",
      100: "#dac1f3",
      200: "#c098e7",
      300: "#a66fdc",
      400: "#8c47d1",
      500: "#732db7", // Primary
      600: "#5a22a0",
      700: "#411888",
      800: "#290e70",
      900: "#140459",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "md",
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "md",
        },
      },
    },
  },
});

export default theme;
