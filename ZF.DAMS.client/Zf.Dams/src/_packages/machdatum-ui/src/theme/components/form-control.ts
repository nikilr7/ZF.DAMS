import { formAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const $fg = cssVar("form-control-color");

const baseStyleRequiredIndicator = defineStyle({
  marginStart: "0.5",
  [$fg.variable]: "colors.red.800",
  _dark: {
    [$fg.variable]: "colors.red.300",
  },
  color: $fg.reference,
});

const baseStyleHelperText = defineStyle({
  mt: "1",
  [$fg.variable]: "colors.neutrals.700",
  _dark: {
    [$fg.variable]: "colors.darkneutrals.700",
  },
  color: $fg.reference,
  lineHeight: "4",
  fontSize: "xs",
});

const baseStyle = definePartsStyle({
  container: {
    width: "100%",
    position: "relative",
  },
  requiredIndicator: baseStyleRequiredIndicator,
  helperText: baseStyleHelperText,
});

export const Form = defineMultiStyleConfig({
  baseStyle,
});
