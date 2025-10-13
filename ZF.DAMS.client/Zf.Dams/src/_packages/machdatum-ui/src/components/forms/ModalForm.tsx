import { memo } from "react";
import {
  Box,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useBoolean,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { IFormWrapper } from "./Form";
import { useFormState } from "react-hook-form";
import Alert from "../Alert";
import { Minimize2, Maximize2 } from "lucide-react";

interface IFormModal {
  isOpen: boolean | undefined | null;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "6xl"
    | "full";
  canMaximize?: boolean;
  onClose: (state?: any) => void;
}

export const ModalForm = (props: IFormWrapper & IFormModal) => {
  const {
    isOpen,
    title,
    description,
    footer,
    onClose,
    children,
    isLoading,
    size,
    canMaximize,
    checkDirty = true,
  } = props;
  const [maximized, setMaximized] = useBoolean(false);
  const { isDirty } = useFormState();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const handleClose = () => {
    if (isDirty && checkDirty) onAlertOpen();
    else onClose();
  };

  return (
    <>
      <Modal
        size={maximized ? "full" : size ?? "xl"}
        isOpen={!!isOpen}
        onClose={handleClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={1} display={"flex"} gap={2}>
            <Box>
              {title}
              {canMaximize && (
                <IconButton
                  onClick={setMaximized.toggle}
                  variant={"subtle"}
                  ml={1}
                  p={2}
                  icon={
                    maximized ? (
                      <Minimize2 size={"1rem"} color="#42526E" />
                    ) : (
                      <Maximize2 size={"1rem"} color="#42526E" />
                    )
                  }
                  aria-label={"toggle-maximize"}
                />
              )}
              {description && (
                <Text fontSize={"xs"} color={"neutrals.700"} py={2}>
                  {description}
                </Text>
              )}
              {isLoading && <Spinner ml={2} size={"xs"} />}
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          <ModalFooter>{footer("rtl")}</ModalFooter>
        </ModalContent>
      </Modal>
      <Alert
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onCancel={onAlertClose}
        onLeave={() => {
          onClose();
          onAlertClose();
        }}
      />
    </>
  );
};

function withModalForm<T>(Component: React.ComponentType<T>) {
  return memo(function FormWrapper(props: T & IFormModal) {
    const Wrapper = (p: IFormWrapper) => <ModalForm {...p} {...props} />;
    return <Component Wrapper={Wrapper} {...props} />;
  });
}

export default withModalForm;
