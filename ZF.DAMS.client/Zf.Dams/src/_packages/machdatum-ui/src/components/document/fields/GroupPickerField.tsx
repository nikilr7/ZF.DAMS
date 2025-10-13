import { IFieldProps } from "../../../hooks/defs";
import { useGroups } from "../../../services/useGroup";
import FormSelect from "../../select/FormSelect";
import FormField from "../../../components/forms/Field";

export const GroupPickerField = ({
  field,
  isEditable,
  isMulti,
}: IFieldProps) => {
  const { entities: groups } = useGroups();
  const { name, label } = field;

  return (
    <FormField name={name} label={label}>
      {(register) => (
        <FormSelect
          name={register.name}
          options={groups.data?.map((g) => ({ id: g.id }))}
          isLoading={groups.isLoading}
          isDisabled={!isEditable}
          getOptionLabel={(option) =>
            groups.data?.find((g) => g.id === option.id)?.label || ""
          }
          getOptionValue={(option) => option.id}
          isMulti={isMulti}
        />
      )}
    </FormField>
  );
};
