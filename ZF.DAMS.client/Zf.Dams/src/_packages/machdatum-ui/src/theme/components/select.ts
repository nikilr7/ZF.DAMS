import { selectAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from "@chakra-ui/styled-system";
import { Input as inputTheme } from "./input";

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const $bg = cssVar("select-bg");

const baseStyleField = defineStyle({
  ...inputTheme.baseStyle?.field,
  py: 0,
  appearance: "none",
  paddingBottom: "1px",
  lineHeight: "normal",
  bg: $bg.reference,
  [$bg.variable]: "colors.white",
  _dark: {
    [$bg.variable]: "colors.gray.700",
  },
  "> option, > optgroup": {
    bg: $bg.reference,
  },
});

const baseStyleIcon = defineStyle({
  width: "6",
  height: "100%",
  insetEnd: "2",
  position: "relative",
  color: "currentColor",
  fontSize: "xl",
  _disabled: {
    opacity: 0.5,
  },
});

const baseStyle = definePartsStyle({
  field: baseStyleField,
  icon: baseStyleIcon,
});

const iconSpacing = defineStyle({
  paddingInlineEnd: "8",
});

const sizes = {
  default: {
    ...inputTheme.sizes?.default,
    field: {
      ...inputTheme.sizes?.default.field,
      ...iconSpacing,
    },
  },
  compact: {
    ...inputTheme.sizes?.compact,
    field: {
      ...inputTheme.sizes?.compact.field,
      ...iconSpacing,
    },
  },
};

export const Select = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants: inputTheme.variants,
  defaultProps: inputTheme.defaultProps,
});
