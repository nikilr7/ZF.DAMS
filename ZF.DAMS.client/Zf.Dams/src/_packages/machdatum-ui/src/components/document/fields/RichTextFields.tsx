import RichText from "../../richtext/RichText";
import RichTextArea from "../../richtext/RichTextArea";
import FormField from "../../../components/forms/Field";
import { IFieldProps } from "../../../hooks/defs";

interface IProps {
  defaultValue?: string;
}

export const RichTextAreaField = ({
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
      {(register) => {
        return (
          <RichTextArea
            {...register}
            size={size}
            isDisabled={!isEditable}
            defaultValue={defaultValue}
          />
        );
      }}
    </FormField>
  );
};

export const RichTextField = ({ field, isEditable }: IFieldProps) => {
  const { name, label } = field;

  return (
    <FormField name={name} label={label}>
      {(register) => <RichText {...register} isDisabled={!isEditable} />}
    </FormField>
  );
};
