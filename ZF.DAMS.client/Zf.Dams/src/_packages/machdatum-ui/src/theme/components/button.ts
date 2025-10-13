import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const defaultVariant = defineStyle({
  color: "neutrals.1000",
  bg: "background.neutral.default",
  _hover: {
    bg: "background.neutral.hovered",
    _disabled: {
      bg: "background.neutral.hovered",
    },
  },
  _active: {
    bg: "background.neutral.pressed",
  },
  _loading: {
    _hover: {
      bg: "background.neutral.hovered",
    },
  },
});

const primaryVariant = defineStyle({
  color: "neutrals.0",
  bg: "background.blue.default",
  _hover: {
    bg: "background.blue.hovered",
    _disabled: {
      bg: "background.blue.hovered",
    },
  },
  _active: {
    bg: "background.blue.pressed",
  },
  _loading: {
    _hover: {
      bg: "background.blue.hovered",
    },
  },
});

const subtleVariant = defineStyle({
  color: "neutrals.1000",
  _hover: {
    bg: "background.neutral.default",
    _disabled: {
      bg: "background.neutral.default",
    },
  },
  _active: {
    bg: "background.neutral.hovered",
  },
  _loading: {
    _hover: {
      bg: "background.neutral.hovered",
    },
  },
});

const warningVariant = defineStyle({
  color: "neutrals.1000",
  bg: "background.yellow.default",
  _hover: {
    bg: "background.yellow.hovered",
    _disabled: {
      bg: "background.yellow.hovered",
    },
  },
  _active: {
    bg: "background.yellow.pressed",
  },
  _loading: {
    _hover: {
      bg: "background.yellow.hovered",
    },
  },
});

const dangerVariant = defineStyle({
  color: "neutrals.0",
  bg: "background.red.default",
  _hover: {
    bg: "background.red.hovered",
    _disabled: {
      bg: "background.red.hovered",
    },
  },
  _active: {
    bg: "background.red.pressed",
  },
  _loading: {
    _hover: {
      bg: "background.red.hovered",
    },
  },
});

const defaultSize = defineStyle({
  fontSize: "sm",
  px: "2.5",
  h: "2rem",
  borderRadius: "base",
});

const compactSize = defineStyle({
  fontSize: "xs",
  px: "2.5",
  h: "1.5rem",
  borderRadius: "base",
});

export const Button = defineStyleConfig({
  sizes: { default: defaultSize, compact: compactSize },
  variants: {
    default: defaultVariant,
    primary: primaryVariant,
    subtle: subtleVariant,
    warning: warningVariant,
    danger: dangerVariant,
  },
  defaultProps: {
    size: "default",
    variant: "primary",
  },
});
