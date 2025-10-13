import {
  cssVar,
  defineStyle,
  defineStyleConfig,
} from "@chakra-ui/styled-system";

const $startColor = cssVar("skeleton-start-color");
const $endColor = cssVar("skeleton-end-color");

const baseStyle = defineStyle({
  [$startColor.variable]: "colors.neutrals.200",
  [$endColor.variable]: "colors.neutrals.300",
  _dark: {
    [$startColor.variable]: "colors.darkneutrals.200",
    [$endColor.variable]: "colors.darkneutrals.300",
  },
  background: $startColor.reference,
  borderColor: $endColor.reference,
  opacity: 0.7,
  borderRadius: "base",
});

export const Skeleton = defineStyleConfig({
  baseStyle,
});
