import { Box, HStack } from "@chakra-ui/react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import {
  IDocument,
  IDocumentAttachment,
  IFileAttachment,
} from "../../../hooks/defs";
import { IInputField } from "../../../hooks/useDocument";
import { useStorage } from "../../../services/useStorage";
import ImageThumbnail from "../ImageThumbnail";
import UploadImage from "./ImageUpload";
import FormField from "../../../components/forms/Field";
import { useDocumentContext } from "../../../context/DocumentConfigurationContext";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { memo, useCallback } from "react";

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

export const useOfflineStorage = () => {
  const { upload } = useStorage();
  const { isOfflineMode } = useDocumentContext();

  const offlineStorage = useMutation<IFileAttachment, AxiosError<any>, any>({
    mutationFn: async (file): Promise<IFileAttachment> => {
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      localStorage.setItem(file.name, fileBase64);

      return {
        id: "00000000-0000-0000-0000-000000000000",
        key: file.name,
        fileName: file.name,
        contentType: file.type,
        createdAt: new Date(),
        base64: fileBase64,
      };
    },
    networkMode: "always",
  });

  return isOfflineMode ? { upload: offlineStorage } : { upload };
};

export const MultiImageSelectField = (props: IFieldProps) => {
  const { root } = props;

  const location = root ? `${root}.attachments` : "attachments";
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: location as any });

  return (
    <MemoMultiImageSelectField
      {...props}
      value={value}
      onChange={onChange}
      error={error}
    />
  );
};

const MemoMultiImageSelectField = memo((props: IFieldProps & IFormProps) => {
  const {
    field,
    isEditable,
    value,
    onChange,
    error,
    size = "default",
    isRequired,
  } = props;
  const { label, name } = field;
  const { upload } = useOfflineStorage();

  const handleAttachment = useCallback(
    (file: any) => {
      upload.mutateAsync(file).then((attachment: IFileAttachment) => {
        const attachments = [...(value ?? [])];
        attachments.push({
          name: field.name,
          fileAttachment: attachment,
        });
        onChange(attachments);
      });
    },
    [field, value, onChange],
  );

  function handleDeleteAttachment(attachmentId: string) {
    const attachments = value?.filter(
      (attachment: IDocumentAttachment) =>
        attachment.fileAttachment.id !== attachmentId,
    );
    onChange(attachments, { shouldDirty: true });
  }

  const attachments = value as IDocumentAttachment[];

  return (
    <FormField
      name={name}
      label={label}
      mt={size === "compact" ? 0 : undefined}
      defaultError={(error as any)?.fields?.[name.split(".")[1]]}
      isRequired={isRequired}
    >
      {() => (
        <HStack w="full">
          <UploadImage
            onChange={handleAttachment}
            size={size}
            isDisabled={!isEditable}
          />
          <Box
            overflow={size === "compact" ? "hidden" : "auto"}
            css={{
              "&::-webkit-scrollbar": {
                width: "6px",
                height: "8px",
              },
            }}
          >
            <HStack>
              {attachments
                ?.filter((attachment) => attachment.name === field.name)
                .map((attachment: any) => (
                  <ImageThumbnail
                    key={attachment.fileAttachment.id}
                    attachment={attachment.fileAttachment}
                    onDelete={() =>
                      handleDeleteAttachment(attachment.fileAttachment.id)
                    }
                    isDisabled={!isEditable}
                    isColumn={size === "compact"}
                  />
                ))}
            </HStack>
          </Box>
        </HStack>
      )}
    </FormField>
  );
});

export const SingleImageSelectField = ({
  field,
  root,
  size = "default",
  isRequired,
}: IFieldProps) => {
  const { label, name } = field;
  const {
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<IDocument>();
  const { upload } = useStorage();

  const location = root ? `${root}.attachments` : "attachments";

  function handleAttachment(file: any) {
    upload.mutateAsync(file).then((attachment: IFileAttachment) => {
      const newAttachment = {
        name: field.name,
        fileAttachment: attachment,
      };
      let attachments = getValues(location as any) ?? [];
      attachments = attachments.filter(
        (attachment: IDocumentAttachment) => attachment.name !== field.name,
      );
      attachments.push(newAttachment);
      setValue(location as any, attachments, { shouldDirty: true });
    });
  }

  function handleDeleteAttachment(attachmentId: string) {
    const attachments = getValues(location as any)?.filter(
      (attachment: IDocumentAttachment) =>
        attachment.fileAttachment.id !== attachmentId,
    );
    setValue(location as any, attachments, { shouldDirty: true });
  }

  const attachments = useWatch({
    name: location as any,
  }) as IDocumentAttachment[];

  return (
    <FormField
      name={name}
      label={label}
      mt={size === "compact" ? 0 : undefined}
      defaultError={(errors?.attachments as any)?.fields?.[name.split(".")[1]]}
      isRequired={isRequired}
    >
      {() => (
        <HStack w="full">
          <UploadImage onChange={handleAttachment} />
          <Box>
            <HStack>
              {attachments
                ?.filter((attachment) => attachment.name === field.name)
                .map((attachment: any) => (
                  <ImageThumbnail
                    key={attachment.fileAttachment.id}
                    attachment={attachment.fileAttachment}
                    onDelete={() =>
                      handleDeleteAttachment(attachment.fileAttachment.id)
                    }
                    isColumn={size === "compact"}
                  />
                ))}
            </HStack>
          </Box>
        </HStack>
      )}
    </FormField>
  );
};
