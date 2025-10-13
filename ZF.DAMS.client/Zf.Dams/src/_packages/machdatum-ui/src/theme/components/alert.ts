import { alertAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  cssVar,
  StyleFunctionProps,
} from "@chakra-ui/styled-system";
import { transparentize } from "@chakra-ui/theme-tools";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const $fg = cssVar("alert-fg");
const $bg = cssVar("alert-bg");

const baseStyle = definePartsStyle({
  container: {
    bg: $bg.reference,
    px: "4",
    py: "1.5",
    fontSize: "sm",
    lineHeight: "5",
  },
  title: {
    fontWeight: "bold",
    lineHeight: "6",
    marginEnd: "2",
  },
  description: {
    lineHeight: "5",
  },
  icon: {
    color: $fg.reference,
    flexShrink: 0,
    marginEnd: "3",
    w: "4",
    h: "5",
  },
  spinner: {
    color: $fg.reference,
    flexShrink: 0,
    marginEnd: "3",
    w: "5",
    h: "5",
  },
});

function getBg(props: StyleFunctionProps) {
  const { theme, colorScheme: c } = props;
  const darkBg = transparentize(`${c}.200`, 0.16)(theme);
  return {
    light: `colors.${c}.100`,
    dark: darkBg,
  };
}

const variantSubtle = definePartsStyle((props) => {
  const { colorScheme: c } = props;
  const bg = getBg(props);
  return {
    container: {
      [$fg.variable]: `colors.${c}.500`,
      [$bg.variable]: bg.light,
      _dark: {
        [$fg.variable]: `colors.${c}.200`,
        [$bg.variable]: bg.dark,
      },
    },
  };
});

const variants = {
  subtle: variantSubtle,
};

export const Alert = defineMultiStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    variant: "subtle",
    size: "xs",
  },
});
