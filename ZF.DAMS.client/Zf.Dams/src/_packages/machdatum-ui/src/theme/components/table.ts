import { tableAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  table: {
    width: "full",
    borderRadius: "base",
  },
  th: {
    fontWeight: "500",
    textTransform: "none",
    height: 10,
    px: 0,
    bg: "neutrals.100",
    color: "neutrals.1000",
    gap: 4,
    top: 0,
    position: "sticky",
    span: {
      borderRadius: "sm",
      width: 4,
      height: 4,
    },
    zIndex: 0,
  },
  td: {
    color: "neutrals.1000",
    height: 10,
    px: 0,
    span: {
      borderRadius: "sm",
      width: 4,
      height: 4,
    },
  },
});

export const Table = defineMultiStyleConfig({ baseStyle });
