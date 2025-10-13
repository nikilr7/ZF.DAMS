import { Flex, HStack } from "@chakra-ui/react";
import ImageThumbnail from "./ImageThumbnail";
import { IDocumentAttachment } from "../../hooks/defs";

export default function ImageViewer({
  attachments,
  name,
}: {
  attachments?: IDocumentAttachment[];
  name?: string;
}) {
  //TODO If image is captured need change prefix `fields.${name}`
  const imageAttachments = attachments?.filter((a: IDocumentAttachment) => {
    return a.name === `fields.${name}`;
  });

  return (
    <Flex direction={"column"}>
      <HStack overflow="hidden">
        {imageAttachments?.map((attachment: IDocumentAttachment) => (
          <ImageThumbnail
            key={attachment.fileAttachment.key}
            attachment={attachment.fileAttachment}
            isColumn
          />
        ))}
      </HStack>
    </Flex>
  );
}
