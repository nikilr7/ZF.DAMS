import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, cssVar } from "@chakra-ui/react";

const $size = cssVar("checkbox-size");

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyle = definePartsStyle({
  label: {
    fontWeight: "normal",
    lineHeight: 4,
    color: "neutrals.1000",
  },
});

const sizes = {
  md: definePartsStyle({
    control: { [$size.variable]: "sizes.4" },
    label: { fontSize: "sm" },
    icon: { fontSize: "2xs" },
  }),
};

export const Checkbox = defineMultiStyleConfig({
  baseStyle,
  sizes,
  defaultProps: {
    size: "md",
  },
});
