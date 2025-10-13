import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { DocumentField } from "./DocumentField";
import { useFormContext } from "react-hook-form";
import { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { isArray } from "lodash";
import { IDocument } from "../../hooks/defs";
import {
  ITransition,
  IDocumentConfiguration,
  IInputField,
} from "../../hooks/useDocument";
import { IHierarchy } from "../../services/useHierarchy";
import { IFormProps, withForm, withModalForm } from "../forms";
import { getDocumentSchema } from "./utils/schema";
import Form from "../forms/Form";
import { useACL } from "./DocumentACL";
import { AxiosError } from "axios";

interface IProps {
  data: IDocument | IDocument[] | undefined;
  transition: ITransition;
  configuration: IDocumentConfiguration;
  mutate: UseMutationResult<any, AxiosError<any>, any, unknown>;
  hierarchy?:
    | IHierarchy
    | { [key: string]: IHierarchy | undefined }
    | undefined;
  renderField?: (name: string, isEnabled: boolean) => React.ReactNode;
  onGetSchema?: (name: string) => any;
  meta?: { [key: string]: any };
}

function TransitionScreen(
  props: IFormProps &
    IProps & {
      fields: (IInputField & { isHardcoded?: boolean })[];
      transition: ITransition;
    },
) {
  const {
    data,
    mutate,
    onClose,
    fields,
    configuration,
    transition,
    hierarchy,
    renderField,
    meta,
  } = props;
  const { handleSubmit, setValue, getValues } = useFormContext();
  const { isPermitted } = useACL();
  const toast = useToast({
    position: "top",
    duration: 1000,
    isClosable: true,
    containerStyle: {
      width: "240px",
      position: "absolute",
      top: "25vh",
      left: "calc(50vw - 120px)",
    },
  });

  const handleSuccess = () => {
    toast({
      title: transition.label + " - Successful",
      status: "success",
    });
    onClose?.();
  };

  const handleError = () => {
    toast({
      title: transition.label + " - Error",
      status: "error",
    });
    onClose?.();
  };

  const handleUpdate = async (transitionData: any) => {
    if (!data) return;

    if (isArray(data)) {
      const updatedData = data.map((item) => ({
        ...item,
        ...transitionData,
        fields: {
          ...item.fields,
          ...transitionData.fields,
        },
      }));

      const documentData = updatedData.map(({ remarks, ...rest }) => rest);

      const transitionDatas = documentData.map((document) => ({
        id: document.id,
        name: transition.name,
        data: document,
        remarks: transitionData.remarks,
        fields: meta,
      }));

      mutate.mutate(transitionDatas, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    } else {
      const documentData: any = {
        ...data,
        ...transitionData,
        fields: { ...data.fields, ...transitionData.fields },
      };

      delete documentData["remarks"];

      mutate.mutate(
        {
          id: data.id,
          name: transition.name,
          data: documentData,
          remarks: transitionData.remarks,
          fields: meta,
        },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        },
      );
    }
  };

  const footer = (direction: "rtl" | "ltr") => (
    <Form.Footer direction={direction}>
      <Button
        onClick={handleSubmit(handleUpdate, (error: any) => {
          console.log("Transition Schema Error:", error);
        })}
        isLoading={mutate.isPending}
      >
        {transition.label}
      </Button>
    </Form.Footer>
  );

  const isEditable = (name: string) => {
    const screen = configuration.screens?.find(
      (s) => s.name === transition.screen,
    );

    if (!screen) return false;

    const field = screen.fields[name];
    if (!field) return false;
    if (field.acl.includes("all")) return true;

    return isPermitted(field.acl, data, hierarchy);
  };

  const isRequired = (name: string) => {
    if (!configuration) return false;

    const screen = configuration.screens?.find(
      (s) => s.name === transition.screen,
    );
    if (!screen) return false;

    return screen.fields[name]?.required;
  };

  useEffect(() => {
    fields.forEach((field) => {
      if (field.type === "date-time" || field.type === "date") {
        const currentValue = getValues(`fields.${field.name}`);
        if (!currentValue)
          setValue(`fields.${field.name}`, new Date().toISOString());
      }
    });
  }, [fields]);

  return (
    <Modal
      size={"xl"}
      isOpen={props.isOpen ?? false}
      onClose={() => {
        props.onClose?.();
      }}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb={1} display={"flex"} gap={2}>
          <Box>{transition.label}</Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form<IDocument> data={isArray(data) ? data[0] : data}>
            {fields?.map((field) => {
              if (field.isHardcoded) {
                return (
                  renderField?.(field.name, isEditable(field.name)) ?? null
                );
              }
              return (
                <DocumentField
                  prefix="fields"
                  isEditable={isEditable(field.name)}
                  key={field.name}
                  field={field}
                  isRequired={isRequired(field.name)}
                />
              );
            })}
            {transition.remarks !== "none" && (
              <Form.Field
                name="remarks"
                label="Remarks"
                isRequired={transition.remarks === "required"}
              >
                {(register) => <Textarea {...register} resize="none" />}
              </Form.Field>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>{footer("rtl")}</ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const TransitionScreenWrapper = (
  props: IProps & { schema?: { [field: string]: z.ZodAny } },
) => {
  const {
    configuration,
    transition,
    schema: parentSchema,
    onGetSchema,
  } = props;

  const screen = useMemo(
    () => configuration?.screens?.find((s) => s.name === transition.screen),
    [configuration?.screens, transition.screen],
  );

  const fields: (IInputField & { isHardcoded?: boolean })[] = useMemo(() => {
    return (
      (Object.entries(screen?.fields ?? {})
        .map(([name]) => {
          const result = configuration.fields?.find((ff) => ff.name === name);

          if (result) {
            return result;
          } else {
            const fieldName = name?.replace(/-(\w)/g, (_, name) =>
              name.toUpperCase(),
            );
            return {
              name: fieldName,
              isHardcoded: true,
            };
          }
        })
        .filter((f) => f !== undefined) as IInputField[]) ?? []
    );
  }, [screen, configuration.fields]);

  const schema: any = useMemo(() => {
    let schema = getDocumentSchema(
      {},
      fields.filter((x) => !x.isHardcoded),
      screen,
    );

    fields
      .filter((x) => x.isHardcoded)
      .forEach((field) => {
        const screenField = screen?.fields[field.name];

        if (onGetSchema) {
          const customSchema = onGetSchema(field.name);

          if (customSchema) {
            schema = schema.extend({
              [field.name]: screenField?.required
                ? customSchema
                : customSchema.optional().nullable(),
            });
            return;
          }
        }

        schema = schema.extend({
          [field.name]: screenField?.required
            ? parentSchema?.[field.name] ?? z.any()
            : parentSchema?.[field.name]?.optional().nullable() ?? z.any(),
        });
      });

    schema = schema.extend({
      remarks:
        transition.remarks === "required"
          ? z
              .string({
                required_error: `Remarks is required`,
                invalid_type_error: `Remarks is required`,
              })
              .min(2, `Remarks must be longer`)
          : z.string().optional().nullable(),
    });

    return schema;
  }, [fields, screen, transition.remarks]);

  const Form = useMemo(() => withForm(TransitionScreen, schema), [schema]);

  return (
    <Form
      {...props}
      configuration={configuration}
      transition={transition}
      fields={fields}
    />
  );
};

export default withModalForm(TransitionScreenWrapper);
