import FormSelect from "../../../components/select/FormSelect";
import FormField from "../../../components/forms/Field";
import { useFormContext, useWatch } from "react-hook-form";
import { IDocument } from "../../../hooks/defs";
import { IFieldProps } from "../../../hooks/defs";

export const SelectField = ({
  field,
  isEditable,
  isMulti,
  isRequired,
}: IFieldProps) => {
  const { name, label, options } = field;
  const { setValue } = useFormContext<IDocument>();

  const handleChange = (selected: any) => {
    const newData = Array.isArray(selected)
      ? selected.map((data) => data.value)
      : [selected.value];

    setValue(name as any, newData);
  };

  const data = useWatch({ name: name as any });
  const values = Array.isArray(data) ? data : [];

  return (
    <FormField name={name} label={label} isRequired={isRequired}>
      {(register) => (
        <FormSelect
          name={register.name}
          isDisabled={!isEditable}
          options={options}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value.toString()}
          onChange={handleChange}
          value={options?.filter(
            (o) =>
              values?.find((v: any) => o.value.toString() === v.toString()),
          )}
          isMulti={isMulti}
          isClearable
        />
      )}
    </FormField>
  );
};
