import React, { useState } from "react";
import {
  Button,
  Center,
  CenterProps,
  HStack,
  Square,
  Text,
  VStack,
} from "@chakra-ui/react";

interface ProfilePictureProps {
  onFileSelect: (file: File) => void;
}

export const ProfilePicture = (props: CenterProps & ProfilePictureProps) => {
  const [_selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      props.onFileSelect(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setImageURL(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Center borderWidth="1px" borderRadius="lg" px="6" py="4" {...props}>
      <VStack spacing="3">
        <Square size="10" bg="bg.subtle" borderRadius="lg">
          {imageURL ? (
            <img
              src={imageURL}
              alt="Selected"
              style={{ maxWidth: "400%", maxHeight: "400%" }}
            />
          ) : null}{" "}
        </Square>
        <VStack spacing="1">
          <HStack spacing="1" whiteSpace="nowrap">
            <Button
              as="label"
              htmlFor="file-input"
              variant="text"
              colorScheme="blue"
              size="sm"
            >
              Click to upload
            </Button>
            <Text textStyle="sm" color="fg.muted">
              or drag and drop
            </Text>
          </HStack>
          <Text textStyle="xs" color="fg.muted">
            PNG, JPG or GIF up to 2MB
          </Text>
        </VStack>
        <input
          id="file-input"
          type="file"
          accept=".png,.jpg,.jpeg,.gif"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </VStack>
    </Center>
  );
};
