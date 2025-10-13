import { StyleFunctionProps, extendTheme } from "@chakra-ui/react";
import { Button } from "./components/button";
import { Breadcrumb } from "./components/breadcrumb";
import { Heading } from "./components/heading";
import { Table } from "./components/table";
import { Checkbox } from "./components/checkbox";
import { Modal } from "./components/modal";
import { FormLabel } from "./components/form-label";
import { Form } from "./components/form-control";
import { FormError } from "./components/form-error";
import { Input } from "./components/input";
import { mode } from "@chakra-ui/theme-tools";
import { Tabs } from "./components/tabs";
import { Alert } from "./components/alert";
import { Skeleton } from "./components/skeleton";
import { Badge } from "./components/badge";
import { Select } from "./components/select";
import { Tag } from "./components/tag";
import { Textarea } from "./components/textarea";
import { Menu } from "./components/menu";
import { Text } from "./components/text";

export const overrides = {
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        fontFamily: "body",
        color: mode("neutrals.1000", "darkneutrals.900")(props),
        bg: mode("neutrals.0", "darkneutrals.100")(props),
        fontSize: "sm",
        lineHeight: "base",
      },
    }),
  },
  colors: {
    background: {
      neutral: {
        default: "#091E420F",
        hovered: "#091E4224",
        pressed: "#091E424F",
      },
      blue: {
        default: "#0C66E4",
        hovered: "#0055CC",
        pressed: "#09326C",
      },
      yellow: {
        default: "#E2B203",
        hovered: "#CF9F02",
        pressed: "#B38600",
      },
      red: {
        default: "#CA3521",
        hovered: "#AE2A19",
        pressed: "#601E16",
      },
    },
    neutrals: {
      0: "#FFFFFF",
      100: "#F7F8F9",
      200: "#F1F2F4",
      300: "#DCDFE4",
      400: "#B3B9C4",
      500: "#8590A2",
      600: "#758195",
      700: "#626F86",
      800: "#44546F",
      900: "#2C3E5D",
      1000: "#172B4D",
      1100: "#091E42",
      "100A": "#091E4208",
      "200A": "#091E420F",
      "300A": "#091E4224",
      "400A": "#091E424F",
      "500A": "#091E427D",
    },
    darkneutrals: {
      0: "#161A1D",
      100: "#1D2125",
      200: "#22272B",
      250: "#282E33",
      300: "#2C333A",
      350: "#38414A",
      400: "#454F59",
      500: "#596773",
      600: "#738496",
      700: "#8C9BAB",
      800: "#9FADBC",
      900: "#B6C2CF",
      1000: "#C7D1DB",
      1100: "#DEE4EA",
      "100A": "#BCD6F00A",
      "200A": "#A1BDD914",
      "250A": "#C8E1F91A",
      "300A": "#A6C5E229",
      "350A": "#C3DEFE33",
      "400A": "#BFDBF847",
      "500A": "#9BB4CA80",
      "-100A": "#03040442",
    },
    blue: {
      100: "#E9F2FF",
      200: "#CCE0FF",
      300: "#85B8FF",
      400: "#579DFF",
      500: "#388BFF",
      600: "#1D7AFC",
      700: "#0C66E4",
      800: "#0055CC",
      900: "#09326C",
      1000: "#092957",
    },
    yellow: {
      100: "#FFF7D6",
      200: "#F8E6A0",
      300: "#F5CD47",
      400: "#E2B203",
      500: "#CF9F02",
      600: "#B38600",
      700: "#946F00",
      800: "#7F5F01",
      900: "#533F04",
      1000: "#3F3102",
    },
    green: {
      100: "#DCFFF1",
      200: "#BAF3DB",
      300: "#7EE2B8",
      400: "#4BCE97",
      500: "#2ABB7F",
      600: "#22A06B",
      700: "#1F845A",
      800: "#216E4E",
      900: "#164B35",
      1000: "#1C3329",
    },
    red: {
      100: "#FFEDEB",
      200: "#FFD2CC",
      300: "#FF9C8F",
      400: "#F87462",
      500: "#EF5C48",
      600: "#E34935",
      700: "#CA3521",
      800: "#AE2A19",
      900: "#601E16",
      1000: "#4F1C16",
    },
    lime: {
      100: "#EFFFD6",
      200: "#D3F1A7",
      300: "#B3DF72",
      400: "#94C748",
      500: "#82B536",
      600: "#6A9A23",
      700: "#5B7F24",
      800: "#4C6B1F",
      900: "#37471F",
      1000: "#28311B",
    },
    orange: {
      100: "#FFF3EB",
      200: "#FEDEC8",
      300: "#FEC195",
      400: "#FEA362",
      500: "#F38A3F",
      600: "#E56910",
      700: "#C25100",
      800: "#A54800",
      900: "#702E00",
      1000: "#38291E",
    },
    teal: {
      100: "#E7F9FF",
      200: "#C6EDFB",
      300: "#9DD9EE",
      400: "#6CC3E0",
      500: "#42B2D7",
      600: "#2898BD",
      700: "#227D9B",
      800: "#206A83",
      900: "#164555",
      1000: "#1E3137",
    },
    purple: {
      100: "#F3F0FF",
      200: "#DFD8FD",
      300: "#B8ACF6",
      400: "#9F8FEF",
      500: "#8F7EE7",
      600: "#8270DB",
      700: "#6E5DC6",
      800: "#5E4DB2",
      900: "#352C63",
      1000: "#2B273F",
    },
    magenta: {
      100: "#FFECF8",
      200: "#FDD0EC",
      300: "#F797D2",
      400: "#E774BB",
      500: "#DA62AC",
      600: "#CD519D",
      700: "#AE4787",
      800: "#943D73",
      900: "#50253F",
      1000: "#3D2232",
    },
  },
  components: {
    Button,
    Breadcrumb,
    Heading,
    Table,
    Checkbox,
    Modal,
    FormLabel,
    Form,
    FormError,
    Input,
    Tabs,
    Alert,
    Skeleton,
    Badge,
    Select,
    Tag,
    Menu,
    Textarea,
    Text,
  },
};

export default extendTheme(overrides);
