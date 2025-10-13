import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system";

const baseStyle = defineStyle({
  fontFamily: "heading",
  color: "neutrals.1000",
  _dark: {
    color: "darkneutrals.900",
  },
});

const H900 = defineStyle({
  fontSize: "4xl",
  fontWeight: "medium",
  lineHeight: 10,
});

const H800 = defineStyle({
  fontSize: "3xl",
  fontWeight: "semibold",
  lineHeight: 8,
});

const H700 = defineStyle({
  fontSize: "2xl",
  fontWeight: "medium",
  lineHeight: 7,
});

const H600 = defineStyle({
  fontSize: "xl",
  fontWeight: "medium",
  lineHeight: 6,
});

const H500 = defineStyle({
  fontSize: "md",
  fontWeight: "semibold",
  lineHeight: 5,
});

const H400 = defineStyle({
  fontSize: "sm",
  fontWeight: "semibold",
  lineHeight: 4,
});

const H300 = defineStyle({
  fontSize: "xs",
  fontWeight: "semibold",
  lineHeight: 4,
});

const H200 = defineStyle({
  fontSize: "xs",
  fontWeight: "semibold",
  lineHeight: 4,
  color: "neutrals.700",
  _dark: {
    color: "darkneutrals.700",
  },
});

const H100 = defineStyle({
  fontSize: "xs",
  fontWeight: "bold",
  lineHeight: 4,
  color: "neutrals.700",
  _dark: {
    color: "darkneutrals.700",
  },
});

export const Heading = defineStyleConfig({
  baseStyle,
  sizes: {},
  defaultProps: {},
  variants: { H100, H200, H300, H400, H500, H600, H700, H800, H900 },
});
