import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { defineStyle } from "@chakra-ui/react";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  header: {
    fontSize: "xl",
    fontWeight: "medium",
    color: "neutrals.1000",
  },
  overlay: {
    bg: "neutrals.500A",
  },
  dialog: {
    borderRadius: "base",
    bg: "neutrals.0",
  },
  body: {
    color: "neutrals.1000",
  },
});

const sm = defineStyle({
  fontSize: "sm",
  px: "10",
});

const md = defineStyle({
  fontSize: "md",
  px: "10",
});

const lg = defineStyle({
  fontSize: "lg",
  px: "10",
});

const xl = defineStyle({
  fontSize: "xl",
  px: "10",
});

const sizes = {
  xl: definePartsStyle({ dialogContainer: xl }),
  sm: definePartsStyle({ dialogContainer: sm }),
  lg: definePartsStyle({ dialogContainer: lg }),
  md: definePartsStyle({ dialogContainer: md }),
};

export const Modal = defineMultiStyleConfig({
  variants: {
    default: baseStyle,
  },
  sizes,
});
