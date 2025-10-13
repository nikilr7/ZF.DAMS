import { breadcrumbAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from "@chakra-ui/styled-system";

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const $decor = cssVar("breadcrumb-link-decor");
const baseStyleLink = defineStyle({
  color: "neutrals.800",
  textDecoration: $decor.reference,
  [$decor.variable]: "none",
  "&:not([aria-current=page])": {
    cursor: "pointer",
    _hover: {
      [$decor.variable]: "underline",
    },
    _focusVisible: {
      boxShadow: "outline",
    },
  },
});

const baseStyleSeparator = defineStyle({
  color: "neutrals.700",
});

const baseStyle = definePartsStyle({
  link: baseStyleLink,
  separator: baseStyleSeparator,
});

export const Breadcrumb = defineMultiStyleConfig({
  baseStyle,
});
