import { useController } from "react-hook-form";
import { IDocumentMasterData } from "../../../hooks/defs";
import { IInputField } from "../../../hooks/useDocument";
import { useMasters, useMaster } from "../../../services/useMaster";
import { useMastersData } from "../../../services/useMasterData";
import FormSelect from "../../select/FormSelect";
import FormField from "../../forms/Field";
import { memo } from "react";

interface IFieldProps {
  field: IInputField;
  root?: string;
  isEditable?: boolean;
  size?: "default" | "compact";
  isMulti?: boolean;
  isRequired?: boolean;
}

interface IFormProps {
  value: IDocumentMasterData[];
  onChange: any;
  error: any;
}

export const MasterField = (props: IFieldProps) => {
  const { root } = props;

  const location = root ? `${root}.masterData` : "masterData";
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: location as any });

  return (
    <MemoMasterField
      {...props}
      value={value}
      onChange={onChange}
      error={error}
    />
  );
};

const MemoMasterField = memo((props: IFieldProps & IFormProps) => {
  const { field, isEditable, isMulti, isRequired } = props;
  const { value, onChange, error } = props;

  const { name, label, source } = field;

  const { entities: masters } = useMasters();
  const soureMaster = masters.data?.find((m) => m.name === source)?.id;
  const { entity: master } = useMaster(soureMaster);
  const { entities: options } = useMastersData(soureMaster ?? "");

  const handleChange = (selected: any) => {
    const newMasterData = Array.isArray(selected)
      ? selected.map((data) => ({
          name: field.name,
          masterData: { id: data.id },
        }))
      : [{ name: field.name, masterData: { id: selected?.id } }];

    let masterData = value ?? [];
    masterData = masterData.filter((m) => m.name !== field.name);
    masterData.push(...newMasterData);

    onChange(masterData);
  };

  const masterData = value;

  return (
    <FormField
      name={name}
      label={label}
      defaultError={(error as any)?.fields?.[name.split(".")[1]]}
      isRequired={isRequired}
    >
      {(register) => (
        <FormSelect<{ id: string }>
          name={register.name}
          options={options.data?.map((u) => ({ id: u.id }))}
          isLoading={options.isLoading}
          isDisabled={!isEditable}
          getOptionLabel={(option) =>
            options.data?.find((u) => u.id === option.id)?.[
              master.data?.displayField || "name"
            ] || ""
          }
          getOptionValue={(option) => option.id}
          onChange={(masterData) => {
            handleChange(masterData);
          }}
          value={
            masterData
              ?.filter((masterData) => masterData.name === field.name)
              .map((m) => ({ id: m.masterData.id })) || []
          }
          isMulti={isMulti}
          isClearable
        />
      )}
    </FormField>
  );
});
