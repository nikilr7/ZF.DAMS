import { useState, useCallback, useRef } from "react";
import {
  Button,
  Image,
  HStack,
  Spinner,
  Box,
  Circle,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Camera, RefreshCcw, Repeat, Upload } from "lucide-react";
import Webcam from "react-webcam";

interface IProps {
  onCapture: (image: string) => void;
}

const ImageCapture = ({ onCapture }: IProps) => {
  const [image, setImage] = useState<string | null | undefined>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const isSmallScreen = useBreakpointValue({ base: true, md: false });
  const webcamRef = useRef<Webcam | null>(null);
  const [isWebcamLoading, setIsWebcamLoading] = useState<boolean>(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isWebcamOpen, setIsWebcamOpen] = useState<boolean>(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImage(imageSrc);
    setIsWebcamOpen(false);
    onOpen();
  }, [webcamRef, onOpen]);

  const toggleCamera = useCallback(() => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  }, []);

  const handleOpenModal = () => {
    setIsWebcamOpen(true);
    onOpen();
  };

  const handleCloseModal = () => {
    setIsWebcamOpen(false);
    setImage(null);
    onClose();
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        variant="outline"
        leftIcon={
          <Camera size={"1.25rem"} color="#42526E" strokeWidth="1.33" />
        }
        w="full"
      >
        Capture Image
      </Button>
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={0}>
            {isWebcamOpen && (
              <Flex
                alignItems="center"
                justifyContent="center"
                height="100dvh"
                position="relative"
                background="black"
                flexDirection="column"
              >
                <ModalCloseButton onClick={handleCloseModal} color={"white"} />
                {isWebcamLoading && (
                  <Spinner
                    size="lg"
                    color="white"
                    alignSelf="center"
                    position="absolute"
                  />
                )}
                <Webcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  ref={webcamRef}
                  videoConstraints={{ facingMode }}
                  onUserMedia={() => setIsWebcamLoading(false)}
                />
                <Box position="absolute" bottom={8}>
                  <Circle
                    onClick={capture}
                    color="white"
                    size="4rem"
                    bg="white"
                    border="5px solid #e6dada"
                  />
                </Box>
                <Box position="absolute" bottom={10} right={4}>
                  {isSmallScreen && (
                    <RefreshCcw
                      size="2.5rem"
                      onClick={toggleCamera}
                      color="white"
                      strokeWidth="1.33"
                    />
                  )}
                </Box>
              </Flex>
            )}
            {image && (
              <Flex
                alignItems="center"
                justifyContent="center"
                width="100vw"
                height="100dvh"
                position="relative"
                background="black"
              >
                <Image src={image} alt="Captured Image" position="relative" />
                <HStack position="absolute" bottom={8} spacing={4}>
                  <Button
                    onClick={() => {
                      setImage(null);
                      setIsWebcamLoading(true);
                      handleOpenModal();
                    }}
                    leftIcon={<Repeat size="1.25rem" />}
                    _hover={{ bg: "white", color: "black" }}
                    variant="outline"
                    color="white"
                    size="md"
                    p={2}
                  >
                    Retake
                  </Button>
                  <Button
                    onClick={() => {
                      onCapture(image);
                      setImage(null);
                      handleCloseModal();
                    }}
                    leftIcon={<Upload size="1.25rem" />}
                    _hover={{ bg: "white", color: "black" }}
                    variant="outline"
                    color="white"
                    size="md"
                    p={2}
                  >
                    Upload
                  </Button>
                </HStack>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImageCapture;
