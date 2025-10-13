import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system";

const baseStyle = defineStyle({
  color: "neutrals.800",
  _dark: {
    color: "darkneutrals.800",
  },
  fontSize: "xs",
  marginEnd: "0",
  mb: "1",
  fontWeight: "semibold",
  transitionProperty: "common",
  transitionDuration: "normal",
  opacity: 1,
  _disabled: {
    opacity: 0.4,
  },
});

export const FormLabel = defineStyleConfig({
  baseStyle,
});
