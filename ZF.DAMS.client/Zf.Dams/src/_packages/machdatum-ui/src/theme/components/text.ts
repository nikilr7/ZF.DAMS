import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system";

const T100 = defineStyle({
  fontSize: "0.74rem",
  lineHeight: "base",
  color: "neutrals.1000",
});

export const Text = defineStyleConfig({
  variants: { T100 },
});
