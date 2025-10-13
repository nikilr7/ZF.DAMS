import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

interface IAlertDialog {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  onLeave: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
}

const Alert = (props: IAlertDialog) => {
  const {
    isOpen,
    onClose,
    onCancel,
    onLeave,
    title = "Unsaved Changes",
    message = "Are you sure you want to leave without saving?",
    confirmText = "Leave",
  } = props;

  const cancelRef = useRef(null);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      closeOnOverlayClick={false}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>{title}</AlertDialogHeader>
        <AlertDialogBody>{message}</AlertDialogBody>
        <AlertDialogFooter>
          <Button onClick={onCancel} variant={"ghost"}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onLeave} ml={3}>
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
