import { Input } from "@chakra-ui/react";
import FormField from "../../forms/Field";
import { IFieldProps } from "../../../hooks/defs";

export const NumberField = ({ field, isEditable, isRequired }: IFieldProps) => {
  const { name, label } = field;

  return (
    <FormField
      name={name}
      label={label}
      options={{ valueAsNumber: true }}
      isRequired={isRequired}
    >
      {(register) => (
        <Input
          {...register}
          type="number"
          isDisabled={!isEditable}
          size={"sm"}
        />
      )}
    </FormField>
  );
};
