import { Box, Input, Button } from "@chakra-ui/react";
import { Paperclip } from "lucide-react";

interface IProps {
  onAttachment(attachment: any): void;
  isDisabled?: boolean;
  attachmentText?: string;
  size?: "default" | "compact";
}

const FileAttachment = ({
  onAttachment,
  isDisabled,
  attachmentText,
  size = "default",
}: IProps) => {
  return (
    <Box>
      <Button
        variant="outline"
        cursor={"pointer"}
        leftIcon={<Paperclip size={"1rem"} />}
        isDisabled={isDisabled}
        width={size === "default" ? "100%" : "35px"}
      >
        {attachmentText
          ? attachmentText
          : size === "default"
          ? "Attach Files"
          : ""}
        <Input
          type="file"
          height="100%"
          position="absolute"
          top="0"
          left="0"
          opacity="0"
          mt={"0px !important"}
          cursor="pointer"
          aria-hidden="true"
          onChange={(event) => onAttachment(event)}
          style={{
            pointerEvents: isDisabled ? "none" : "auto",
          }}
        />
      </Button>
    </Box>
  );
};

export default FileAttachment;
