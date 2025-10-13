import { avatarAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(avatarAnatomy.keys);

const baseStyle = definePartsStyle({
  container: { borderRadius: "base", color: "neutrals.0" },
});

export const Avatar = defineMultiStyleConfig({
  baseStyle,
  defaultProps: { size: "sm" },
});
