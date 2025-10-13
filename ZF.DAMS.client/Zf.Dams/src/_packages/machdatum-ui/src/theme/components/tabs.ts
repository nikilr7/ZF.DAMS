import { tabsAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from "@chakra-ui/styled-system";

const $fg = cssVar("tabs-color");
const $bg = cssVar("tabs-bg");

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyleRoot = defineStyle((props) => {
  const { orientation } = props;
  return {
    display: orientation === "vertical" ? "flex" : "block",
  };
});

const baseStyleTab = defineStyle((props) => {
  const { isFitted } = props;

  return {
    flex: isFitted ? 1 : undefined,
    transitionProperty: "common",
    transitionDuration: "normal",
    _focusVisible: {
      zIndex: 1,
      boxShadow: "outline",
    },
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.4,
    },
  };
});

const baseStyleTablist = defineStyle((props) => {
  const { align = "start", orientation } = props;

  const alignments: Record<string, string> = {
    end: "flex-end",
    center: "center",
    start: "flex-start",
  };

  return {
    justifyContent: alignments[align],
    flexDirection: orientation === "vertical" ? "column" : "row",
  };
});

const baseStyleTabpanel = defineStyle({
  px: 4,
  py: 0,
});

const baseStyle = definePartsStyle((props) => ({
  root: baseStyleRoot(props),
  tab: baseStyleTab(props),
  tablist: baseStyleTablist(props),
  tabpanel: baseStyleTabpanel,
}));

const sizes = {
  default: definePartsStyle({
    tab: {
      py: 2,
      px: 2,
      fontSize: "sm",
    },
  }),
};

const variantLine = definePartsStyle((props) => {
  const { colorScheme: orientation } = props;
  const isVertical = orientation === "vertical";
  const marginProp = isVertical ? "marginStart" : "marginBottom";

  return {
    tablist: {
      borderColor: "neutrals.300A",
      _dark: {
        borderColor: "darkneutrals.300A",
      },
    },
    tab: {
      [marginProp]: "-2px",
      _selected: {
        [$fg.variable]: "colors.blue.500",
        _dark: {
          [$fg.variable]: `colors.blue.400`,
        },
        borderColor: "blue.700",
      },
      _hover: {
        borderColor: "blue.500",
        _dark: {
          borderColor: "darkneutrals.300A",
        },
        bg: "neutrals.100",
      },
      _active: {
        [$bg.variable]: "transparent",
        _dark: {
          [$bg.variable]: "transparent",
        },
      },
      _disabled: {
        _active: { bg: "none" },
      },
      color: $fg.reference,
      bg: $bg.reference,
    },
  };
});

const variants = {
  line: variantLine,
};

export const Tabs = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    size: "default",
    variant: "line",
    colorScheme: "blue",
  },
});
