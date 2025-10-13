import { useFormContext } from "react-hook-form";
import { Switch } from "@chakra-ui/react";
import FormField from "../../../components/forms/Field";
import { IFieldProps } from "../../../hooks/defs";

export const SwitchField = ({ field, isEditable, isRequired }: IFieldProps) => {
  const { name, label } = field;
  const { watch, setValue } = useFormContext();

  return (
    <FormField name={name} label={label} isRequired={isRequired}>
      {() => (
        <Switch
          isChecked={watch(name)}
          onChange={(e) => setValue(name, e.target.checked)}
          isDisabled={!isEditable}
        />
      )}
    </FormField>
  );
};
