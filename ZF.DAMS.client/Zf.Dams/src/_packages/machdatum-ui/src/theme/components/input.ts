import { inputAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from "@chakra-ui/styled-system";
import { getColor, mode } from "@chakra-ui/theme-tools";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const $height = cssVar("input-height");
const $fontSize = cssVar("input-font-size");
const $padding = cssVar("input-padding");
const $borderRadius = cssVar("input-border-radius");

const baseStyle = definePartsStyle({
  addon: {
    height: $height.reference,
    fontSize: $fontSize.reference,
    py: $padding.reference,
    borderRadius: $borderRadius.reference,
  },
  field: {
    width: "100%",
    height: $height.reference,
    fontSize: $fontSize.reference,
    py: $padding.reference,
    px: "1.5",
    borderRadius: $borderRadius.reference,
    minWidth: 0,
    outline: 0,
    position: "relative",
    appearance: "none",
    transitionProperty: "common",
    transitionDuration: "normal",
    _disabled: {
      opacity: 1,
      cursor: "not-allowed",
    },
  },
});

const size = {
  default: defineStyle({
    [$fontSize.variable]: "fontSizes.sm",
    [$padding.variable]: "space.2",
    [$borderRadius.variable]: "radii.base",
    [$height.variable]: "sizes.10",
  }),
  compact: defineStyle({
    [$fontSize.variable]: "fontSizes.sm",
    [$padding.variable]: "space.1",
    [$borderRadius.variable]: "radii.base",
    [$height.variable]: "sizes.8",
  }),
};

const sizes = {
  default: definePartsStyle({
    field: size.default,
    group: size.default,
  }),
  compact: definePartsStyle({
    field: size.compact,
    group: size.compact,
  }),
};

function getDefaults(props: Record<string, any>) {
  const { focusBorderColor: fc, errorBorderColor: ec } = props;
  return {
    focusBorderColor: fc || mode("blue.500", "blue.300")(props),
    errorBorderColor: ec || mode("red.600", "red.500")(props),
  };
}

const variantStandard = definePartsStyle((props) => {
  const { theme } = props;
  const { focusBorderColor: fc, errorBorderColor: ec } = getDefaults(props);

  return {
    field: {
      border: "1.5px solid",
      borderColor: "inherit",
      bg: "inherit",
      _hover: {
        borderColor: mode("neutrals.300A", "darkneutrals.300A")(props),
      },
      _readOnly: {
        boxShadow: "none !important",
        userSelect: "all",
        backgroundColor: "neutrals.200",
      },
      _invalid: {
        borderColor: getColor(theme, ec),
        boxShadow: `0 0 0 1px ${getColor(theme, ec)}`,
      },
      _focusVisible: {
        zIndex: 1,
        borderColor: getColor(theme, fc),
        boxShadow: `0 0 0 1px ${getColor(theme, fc)}`,
      },
    },
    addon: {
      //TODO Figure out the right colors for Add On
      border: "1px solid",
      borderColor: mode("inherit", "whiteAlpha.50")(props),
      bg: mode("gray.100", "whiteAlpha.300")(props),
    },
  };
});

const variants = {
  standard: variantStandard,
};

export const Input = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    size: "compact",
    variant: "standard",
  },
});
