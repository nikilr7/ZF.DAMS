import {
  defineCssVars,
  defineStyle,
  defineStyleConfig,
} from "@chakra-ui/styled-system";
import { transparentize } from "@chakra-ui/theme-tools";

const vars = defineCssVars("badge", ["bg", "color", "shadow"]);

const baseStyle = defineStyle({
  px: 1,
  py: 0.5,
  textTransform: "none",
  fontSize: "xs",
  borderRadius: "base",
  fontWeight: "normal",
  bg: vars.bg.reference,
  color: vars.color.reference,
  boxShadow: vars.shadow.reference,
});

const variantSolid = defineStyle((props) => {
  const { colorScheme: c, theme } = props;
  const dark = transparentize(`${c}.500`, 0.6)(theme);
  return {
    [vars.bg.variable]: `colors.${c}.500`,
    [vars.color.variable]: `colors.white`,
    _dark: {
      [vars.bg.variable]: dark,
      [vars.color.variable]: `colors.whiteAlpha.800`,
    },
  };
});

const variantSubtle = defineStyle((_props) => {
  return {
    [vars.bg.variable]: `colors.neutrals.200A`,
    [vars.color.variable]: `colors.neutrals.1000`,
    _dark: {
      [vars.bg.variable]: `colors.darkneutrals.200A`,
      [vars.color.variable]: `colors.darkneutrals.900`,
    },
  };
});

const variantOutline = defineStyle((props) => {
  const { colorScheme: c, theme } = props;
  const darkColor = transparentize(`${c}.200`, 0.8)(theme);
  return {
    [vars.color.variable]: `colors.${c}.500`,
    _dark: {
      [vars.color.variable]: darkColor,
    },
    [vars.shadow.variable]: `inset 0 0 0px 1px ${vars.color.reference}`,
  };
});

const variants = {
  solid: variantSolid,
  subtle: variantSubtle,
  outline: variantOutline,
};

export const Badge = defineStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    variant: "subtle",
  },
});

export { vars as badgeVars };
