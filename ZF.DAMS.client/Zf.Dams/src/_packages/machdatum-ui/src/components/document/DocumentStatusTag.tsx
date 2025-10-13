import { Box } from "@chakra-ui/react";
import { IDocumentConfiguration } from "../../hooks/useDocument";
import theme from "../../theme";

interface IProps {
  status: string;
  configuration: IDocumentConfiguration | undefined;
}

function DocumentStatusTag(props: IProps) {
  const { status, configuration } = props;
  const currentStatus = configuration?.statuses?.find((s) => status === s.name);
  const label = currentStatus?.label;

  return (
    <Box
      {...getStatusStyles(status, configuration)}
      px={2}
      py={0.5}
      h={"fit-content"}
      borderRadius="base"
      fontSize="13px"
      fontWeight="semibold"
      display="flex"
      justifyContent={"center"}
      alignItems={"center"}
      w={"fit-content"}
      cursor={"default"}
    >
      {label ?? status}
    </Box>
  );
}

export function getStatusStyles(
  status: string,
  configuration?: IDocumentConfiguration,
) {
  const currentStatus = configuration?.statuses?.find((s) => status === s.name);
  const colorName = currentStatus?.color?.split(".")[0];
  const bg =
    status === "Delayed"
      ? "red.200"
      : colorName
      ? theme.colors[colorName]?.[200]
      : "neutrals.300";
  const color =
    status === "Delayed"
      ? "red.800"
      : colorName
      ? theme.colors[colorName]?.[800]
      : "neutrals.800";

  return { bg, color };
}

export default DocumentStatusTag;
