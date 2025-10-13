import { Box, HStack, Text, useTheme } from "@chakra-ui/react";
import { IStatus } from "../../hooks/useDocument";
import tinycolor from "tinycolor2";

interface IProps {
  current: string;
  statuses: IStatus[];
}

export default function StatusTag(props: IProps) {
  const { current, statuses } = props;
  const currentIndex = statuses.findIndex((status) => status.name === current);

  const theme = useTheme();

  const getStyle = (
    status: IStatus,
    index: number,
    currentIndex: number,
    theme: any,
  ) => {
    let bg: string =
      index === currentIndex
        ? status.color ?? "green.600"
        : index < currentIndex
        ? "green.600"
        : "neutrals.300";

    const [colorName, colorShade] = bg.split(".");
    bg =
      theme.colors[colorName] && theme.colors[colorName]?.[colorShade]
        ? theme.colors[colorName][colorShade]
        : theme.colors[colorName]?.[500] ?? "neutrals.300";

    const color = tinycolor(bg).isDark() ? "white" : "black";

    return { bg, color };
  };

  return (
    <HStack flexWrap={"wrap"}>
      {statuses.map((status, index) => {
        const style = getStyle(status, index, currentIndex, theme);

        return (
          <Box
            key={status.name}
            py={1}
            flex={"1 1 auto"}
            w="1px"
            borderRadius={"base"}
            textAlign={"center"}
            minWidth={"fit-content"}
            px={2}
            {...style}
          >
            <Text
              fontSize={"xs"}
              fontWeight={
                index === currentIndex
                  ? "medium"
                  : index < currentIndex
                  ? "normal"
                  : "normal"
              }
            >
              {status.label}
            </Text>
          </Box>
        );
      })}
    </HStack>
  );
}
