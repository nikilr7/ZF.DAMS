import {
  Stack,
  Text,
  Input,
  Button,
  useDisclosure,
  VStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Box,
} from "@chakra-ui/react";
import ImageCapture from "../../../components/ImageCapture";
import { Camera, Upload } from "lucide-react";

interface IProps {
  onChange(file: any): void;
  isDisabled?: boolean;
  size?: "default" | "compact";
}

const UploadImage = (props: IProps) => {
  const { onChange, isDisabled, size = "default" } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();

  async function base64toFile(
    base64Data: string,
    filename: string,
  ): Promise<File> {
    const response = await fetch(base64Data);
    const blob = await response.blob();

    return new File([blob], filename, { type: "image/jpeg" });
  }

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="right">
      <PopoverTrigger>
        <Stack
          as={Button}
          flexDir={"row"}
          h={size === "compact" ? "35px" : "65px"}
          w={size === "compact" ? "35px" : "240px"}
          minH="35px"
          minW="35px"
          variant="outline"
          border={"dashed 1px"}
          alignSelf={"stretch"}
          onClick={onOpen}
          isDisabled={isDisabled}
        >
          <Camera size={"1rem"} />
          {size === "compact" ? null : (
            <Text fontSize={"sm"}>Upload Image</Text>
          )}
        </Stack>
      </PopoverTrigger>
      <Portal appendToParentPortal={false}>
        <Box
          sx={{
            "& .chakra-popover__popper": {
              zIndex: "popover",
            },
          }}
        >
          <PopoverContent w={"4xs"}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <VStack mt={6} mb={2} mx={1}>
                <Button
                  variant="outline"
                  cursor={"pointer"}
                  leftIcon={
                    <Upload
                      size={"1.15rem"}
                      color="#42526E"
                      strokeWidth="1.33"
                    />
                  }
                  w={"full"}
                >
                  Upload
                  <Input
                    type="file"
                    height="100%"
                    width="100%"
                    position="absolute"
                    top="0"
                    left="0"
                    opacity="0"
                    mt={"0px !important"}
                    cursor="pointer"
                    aria-hidden="true"
                    onChange={(e) => {
                      onChange(e.target.files?.[0]);
                      onClose();
                    }}
                    accept="image/*"
                  />
                </Button>
                <Text>(or)</Text>
                <ImageCapture
                  onCapture={async (imageByteArray) => {
                    const file = await base64toFile(
                      imageByteArray,
                      "image.jpeg",
                    );
                    onChange(file);
                  }}
                />
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Box>
      </Portal>
    </Popover>
  );
};

export default UploadImage;
