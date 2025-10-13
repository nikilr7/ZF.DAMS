import { useController } from "react-hook-form";
import FormField from "../../../components/forms/Field";
import { HStack, Link, Text, IconButton, Stack } from "@chakra-ui/react";
import { X } from "lucide-react";
import { IDocumentAttachment, IFileAttachment } from "../../../hooks/defs";
import { IInputField } from "../../../hooks/useDocument";
import FileAttachment from "../../FileAttachment";
import { useOfflineStorage } from "./ImageSelectField";
import { memo } from "react";

interface IFieldProps {
  field: IInputField;
  root?: string;
  isEditable?: boolean;
  size?: "default" | "compact";
  isRequired?: boolean;
}

interface IFormProps {
  value: any;
  onChange: any;
  error: any;
}

export const FileAttachementField = (props: IFieldProps) => {
  const { root } = props;

  const location = root ? `${root}.attachments` : "attachments";
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: location as any });

  return (
    <MemoFileAttachementField
      {...props}
      value={value}
      onChange={onChange}
      error={error}
    />
  );
};

const MemoFileAttachementField = memo((props: IFieldProps & IFormProps) => {
  const {
    field,
    isEditable,
    value,
    onChange,
    error,
    size = "default",
    isRequired = false,
  } = props;
  const { label, name } = field;

  const { upload } = useOfflineStorage();
  const attachments = value as IDocumentAttachment[];

  function handleAttachment(event: any) {
    const file = event.target.files[0];
    upload.mutateAsync(file).then((attachment: IFileAttachment) => {
      const updatedAttachments = [...(attachments ?? [])];
      updatedAttachments.push({
        name: field.name,
        fileAttachment: attachment,
      });
      onChange(updatedAttachments);
    });
  }

  function onDeleteAttachment(key: string) {
    onChange(attachments.filter((a) => a.fileAttachment.key !== key));
  }

  return (
    <FormField
      name={name}
      label={label}
      defaultError={(error as any)?.fields?.[name.split(".")[1]]}
      isRequired={isRequired}
    >
      {() => (
        <Stack align={"left"} flexDir="row">
          <FileAttachment
            isDisabled={!isEditable}
            onAttachment={handleAttachment}
            size={size}
          />
          <HStack>
            {attachments
              ?.filter((attachment) => attachment.name === field.name)
              .map((a, i) => (
                <HStack
                  as={Link}
                  variant="ghost"
                  href={`/api/storage/` + a.fileAttachment.key}
                  justifyContent="space-between"
                  px="2"
                  py="0.5"
                  textDecoration={"none !important"}
                  borderRadius="md"
                  backgroundColor={"gray.100"}
                  isExternal
                >
                  <Text
                    overflow={"hidden"}
                    textOverflow="ellipsis"
                    whiteSpace={"nowrap"}
                    fontSize={"xs"}
                  >
                    {size === "default" ? a.fileAttachment.fileName : i + 1}
                  </Text>
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteAttachment(a.fileAttachment.key);
                    }}
                    variant={"ghost"}
                    icon={<X size="1rem" color="#42526E" strokeWidth="1.33" />}
                    aria-label={""}
                    isDisabled={!isEditable}
                  />
                </HStack>
              ))}
          </HStack>
        </Stack>
      )}
    </FormField>
  );
});
