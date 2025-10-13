import { tagAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from "@chakra-ui/styled-system";
import { Badge as badgeTheme, badgeVars } from "./badge";

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const $bg = cssVar("tag-bg");
const $color = cssVar("tag-color");
const $shadow = cssVar("tag-shadow");
const $minH = cssVar("tag-min-height");
const $minW = cssVar("tag-min-width");
const $fontSize = cssVar("tag-font-size");
const $paddingX = cssVar("tag-padding-inline");

const baseStyleContainer = defineStyle({
  fontWeight: "normal",
  lineHeight: 1.1,
  outline: 0,
  [$color.variable]: badgeVars.color.reference,
  [$bg.variable]: badgeVars.bg.reference,
  [$shadow.variable]: badgeVars.shadow.reference,
  color: $color.reference,
  bg: $bg.reference,
  boxShadow: $shadow.reference,
  borderRadius: "base",
  minH: $minH.reference,
  minW: $minW.reference,
  fontSize: "xs",
  px: $paddingX.reference,
  _focusVisible: {
    [$shadow.variable]: "shadows.outline",
  },
});

const baseStyleLabel = defineStyle({
  lineHeight: 1.1,
  overflow: "visible",
  pl: 1.5,
});

const baseStyleCloseButton = defineStyle({
  fontSize: "xs",
  pr: "0.5",
  w: "4",
  h: "4",
  transitionProperty: "common",
  transitionDuration: "normal",
  borderRadius: "full",
  //   marginStart: "1.5",
  marginEnd: "0.25",
  opacity: 0.5,
  _disabled: {
    opacity: 0.4,
  },
  _focusVisible: {
    boxShadow: "outline",
    bg: "rgba(0, 0, 0, 0.14)",
  },
  _hover: {
    opacity: 0.8,
  },
  _active: {
    opacity: 1,
  },
});

const baseStyle = definePartsStyle({
  container: baseStyleContainer,
  label: baseStyleLabel,
  closeButton: baseStyleCloseButton,
});

const sizes = {
  default: definePartsStyle({
    container: {},
  }),
  sm: definePartsStyle({
    container: {
      [$minH.variable]: "sizes.5",
      [$minW.variable]: "sizes.5",
      [$fontSize.variable]: "fontSizes.xs",
      [$paddingX.variable]: "space.2",
    },
    closeButton: {
      marginEnd: "-2px",
      marginStart: "0.35rem",
    },
  }),
  md: definePartsStyle({
    container: {
      [$minH.variable]: "sizes.6",
      [$minW.variable]: "sizes.6",
      [$fontSize.variable]: "fontSizes.sm",
      [$paddingX.variable]: "space.2",
    },
  }),
  lg: definePartsStyle({
    container: {
      [$minH.variable]: "sizes.8",
      [$minW.variable]: "sizes.8",
      [$fontSize.variable]: "fontSizes.md",
      [$paddingX.variable]: "space.3",
    },
  }),
};

const variants = {
  subtle: definePartsStyle((props) => ({
    container: badgeTheme.variants?.subtle(props),
  })),
  solid: definePartsStyle((props) => ({
    container: badgeTheme.variants?.solid(props),
  })),
  outline: definePartsStyle((props) => ({
    container: badgeTheme.variants?.outline(props),
  })),
};

export const Tag = defineMultiStyleConfig({
  variants,
  baseStyle,
  sizes,
  defaultProps: {
    size: "default",
    variant: "subtle",
  },
});
