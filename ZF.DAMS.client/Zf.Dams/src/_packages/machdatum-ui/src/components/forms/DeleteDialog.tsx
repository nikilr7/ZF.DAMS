import { PropsWithChildren, useRef } from "react";
import {
  AlertDialog,
  Text,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Heading,
} from "@chakra-ui/react";

interface IProps {
  isOpen: boolean;
  onClose(): void;
  onConfirm(): void;
}

function DeleteDialog({
  children,
  isOpen,
  onClose,
  onConfirm,
}: PropsWithChildren<IProps>) {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          {children}
          <AlertDialogFooter>
            <Button ref={cancelRef} variant={"subtle"} onClick={onClose}>
              Cancel
            </Button>
            <Button variant={"danger"} onClick={onConfirm} ml={3}>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

DeleteDialog.Header = ({ children }: PropsWithChildren) => (
  <AlertDialogHeader>
    <Heading variant={"H600"}>{children}</Heading>
  </AlertDialogHeader>
);

DeleteDialog.Body = ({ children }: PropsWithChildren) => (
  <AlertDialogBody>
    <Text fontSize={"sm"}>{children}</Text>
  </AlertDialogBody>
);

export default DeleteDialog;
