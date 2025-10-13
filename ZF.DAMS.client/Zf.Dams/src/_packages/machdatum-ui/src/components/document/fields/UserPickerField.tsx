import FormField from "../../../components/forms/Field";
import { IFieldProps } from "../../../hooks/defs";
import { useUsers } from "../../../services/useUser";
import FormSelect from "../../select/FormSelect";

export const UserPickerField = ({
  field,
  isEditable,
  isMulti,
}: IFieldProps) => {
  const { entities: users } = useUsers<any>();
  const { name, label } = field;

  return (
    <FormField name={name} label={label}>
      {(register) => (
        <FormSelect<{ id: string }>
          name={register.name}
          options={users.data?.map((u) => ({ id: u.id }))}
          isLoading={users.isLoading}
          isDisabled={!isEditable}
          getOptionLabel={(option) => {
            const user = users?.data?.find((u) => u.id === option.id);
            return user?.displayName ?? "";
          }}
          getOptionValue={(option) => option.id}
          isMulti={isMulti}
        />
      )}
    </FormField>
  );
};
