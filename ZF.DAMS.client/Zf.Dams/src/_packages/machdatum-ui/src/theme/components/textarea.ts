import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system";
import { Input as inputTheme } from "./input";

const baseStyle = defineStyle({
  ...inputTheme.baseStyle?.field,
  paddingY: "2",
  minHeight: "20",
  lineHeight: "short",
  verticalAlign: "top",
});

const variants = {
  standard: defineStyle(
    (props) => inputTheme.variants?.standard(props).field ?? {},
  ),
};

const sizes = {
  default: inputTheme.sizes?.default.field ?? {},
};

export const Textarea = defineStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    size: "default",
    variant: "standard",
  },
});
