import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  IconButton,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import { useDisclosure } from "@chakra-ui/react";
import { useDocumentContext } from "../../context/DocumentConfigurationContext";
import { IFileAttachment } from "../../hooks/defs";

interface IProps {
  attachment: IFileAttachment | undefined;
  url?: string;
  onDelete?(): void;
  isColumn?: boolean;
  isDisabled?: boolean;
}

const ImageThumbnail = (props: IProps) => {
  const { url, attachment, onDelete, isColumn, isDisabled } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOfflineMode } = useDocumentContext();

  const getBackgroundImage = (params: string) => {
    if (isOfflineMode && attachment?.key) {
      const base64Url = localStorage.getItem(attachment?.key ?? "");
      return `${base64Url}`;
    }

    if (attachment?.id === "00000000-0000-0000-0000-000000000000")
      return attachment?.base64 ?? "";

    return attachment
      ? `url("/api/storage/image/${attachment.key}${params}")`
      : url ?? "";
  };

  return (
    <>
      <Box
        borderRadius="base"
        border={"1px solid"}
        borderColor={"blue.800"}
        backgroundImage={getBackgroundImage("?h=100&w=150")}
        backgroundPosition="50%"
        backgroundSize={"cover"}
        backgroundRepeat="no-repeat"
        h={isColumn ? "35px" : "100px"}
        w={isColumn ? "35px" : "150px"}
        role="group"
        position={"relative"}
        onClick={onOpen}
        flex="0 0 auto"
      >
        {!isColumn && (
          <IconButton
            variant={"link"}
            position="absolute"
            right={1}
            top={1}
            visibility={"hidden"}
            _groupHover={{ visibility: "visible" }}
            borderRadius={"full"}
            background={"red.700"}
            p={"2px"}
            icon={<X size="12px" color="white" strokeWidth="2" />}
            aria-label={""}
            onClick={onDelete}
            isDisabled={isDisabled}
          />
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minWidth="fit-content" height="fit-content">
          <ModalBody padding={0} maxWidth={"90vw"} maxHeight={"90vh"}>
            <Box
              backgroundImage={getBackgroundImage("")}
              backgroundSize={"contain"}
              backgroundPosition={"center"}
              backgroundRepeat="no-repeat"
              backgroundColor={"black"}
              height="70vh"
              width="70vw"
            ></Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImageThumbnail;
