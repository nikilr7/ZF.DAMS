import { Input, Textarea } from "@chakra-ui/react";
import FormField from "../../../components/forms/Field";
import { IFieldProps } from "../../../hooks/defs";

interface IProps {
  defaultValue?: string;
}

export const TextField = ({
  field,
  isEditable,
  defaultValue,
  size = "default",
  isRequired,
}: IFieldProps & IProps) => {
  const { name, label } = field;

  return (
    <FormField
      mt={size === "compact" ? 0 : undefined}
      name={name}
      label={label}
      isRequired={isRequired}
    >
      {(register) => (
        <Input
          {...register}
          isDisabled={!isEditable}
          defaultValue={defaultValue}
        />
      )}
    </FormField>
  );
};

export const TextAreaField = ({
  field,
  isEditable,
  isRequired,
}: IFieldProps) => {
  const { name, label } = field;

  return (
    <FormField name={name} label={label} isRequired={isRequired}>
      {(register) => (
        <Textarea {...register} isDisabled={!isEditable} resize={"none"} />
      )}
    </FormField>
  );
};
