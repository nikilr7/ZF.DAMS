import { menuAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from "@chakra-ui/styled-system";

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const $bg = cssVar("menu-bg");
const $shadow = cssVar("menu-shadow");

const baseStyleList = defineStyle({
  [$bg.variable]: "colors.neutrals.0",
  [$shadow.variable]: "shadows.sm",
  _dark: {
    [$bg.variable]: "colors.darkneutrals.250",
    [$shadow.variable]: "shadows.dark-lg",
  },
  color: "inherit",
  minW: "3xs",
  py: "2",
  zIndex: 1,
  borderRadius: "base",
  borderWidth: "1px",
  bg: $bg.reference,
  boxShadow: $shadow.reference,
});

const baseStyleItem = defineStyle({
  py: "1.5",
  px: "3",
  transitionProperty: "background",
  transitionDuration: "ultra-fast",
  transitionTimingFunction: "ease-in",
  _active: {
    [$bg.variable]: "colors.neutrals.300A",
    _dark: {
      [$bg.variable]: "colors.darkneutrals.300A",
    },
  },
  _expanded: {
    [$bg.variable]: "colors.gray.100",
    _dark: {
      [$bg.variable]: "colors.whiteAlpha.100",
    },
  },
  _hover: {
    [$bg.variable]: "colors.neutrals.200A",
    _dark: {
      [$bg.variable]: "colors.darkneutrals.200A",
    },
  },
  _disabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  bg: $bg.reference,
});

const baseStyleGroupTitle = defineStyle({
  mx: 4,
  my: 2,
  fontWeight: "semibold",
  fontSize: "sm",
});

const baseStyleIcon = defineStyle({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const baseStyleCommand = defineStyle({
  opacity: 0.6,
});

const baseStyleDivider = defineStyle({
  border: 0,
  borderBottom: "1px solid",
  borderColor: "inherit",
  my: "2",
  opacity: 0.6,
});

const baseStyleButton = defineStyle({
  transitionProperty: "common",
  transitionDuration: "normal",
});

const baseStyle = definePartsStyle({
  button: baseStyleButton,
  list: baseStyleList,
  item: baseStyleItem,
  groupTitle: baseStyleGroupTitle,
  icon: baseStyleIcon,
  command: baseStyleCommand,
  divider: baseStyleDivider,
});

export const Menu = defineMultiStyleConfig({
  baseStyle,
});
