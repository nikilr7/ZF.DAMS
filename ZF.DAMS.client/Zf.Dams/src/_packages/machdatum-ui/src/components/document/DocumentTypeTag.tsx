import { Box } from "@chakra-ui/react";
import theme from "../../theme";
import { useDocumentContext } from "../../context/DocumentConfigurationContext";

interface IProps {
  type: string | undefined;
  documentType: string | undefined;
}

function DocumentTypeTag(props: IProps) {
  const { type, documentType } = props;

  const { types } = useDocumentContext();
  const documentTypes = documentType ? types(documentType) : [];

  const currentType = documentTypes?.find((t) => type === t.name);
  const colorName = currentType?.color?.split(".")[0];
  const bgColor = colorName ? theme.colors[colorName]?.[200] : "neutrals.300";
  const textColor = colorName ? theme.colors[colorName]?.[800] : "neutrals.800";

  return currentType?.label ? (
    <Box
      bg={bgColor}
      color={textColor}
      px={2}
      py={0.5}
      h={6}
      borderRadius="base"
      fontSize="13px"
      fontWeight="semibold"
      display="flex"
      justifyContent={"center"}
      alignItems={"center"}
      w={"fit-content"}
      cursor={"default"}
      isTruncated
    >
      {currentType?.label}
    </Box>
  ) : null;
}

export default DocumentTypeTag;
