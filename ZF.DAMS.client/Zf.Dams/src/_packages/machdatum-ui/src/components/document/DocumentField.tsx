import { useMemo } from "react";
import { IInputField, IFieldProperty } from "../../hooks/useDocument";
import { AssigneePickerField } from "./fields/AssigneePickerField";
import { DateField, DateTimeField } from "./fields/DateFields";
import { FileAttachementField } from "./fields/FileAttachementField";
import { GroupPickerField } from "./fields/GroupPickerField";
import {
  SingleImageSelectField,
  MultiImageSelectField,
} from "./fields/ImageSelectField";
import { MasterField } from "./fields/MasterField";
import { NumberField } from "./fields/NumberField";
import { RichTextAreaField } from "./fields/RichTextFields";
import { SelectField } from "./fields/SelectField";
import { TextField, TextAreaField } from "./fields/TextFields";
import { UserPickerField } from "./fields/UserPickerField";
import { SwitchField } from "./fields/SwitchField";

interface IProps {
  field: IInputField;
  root?: string;
  prefix?: string;
  isEditable?: boolean;
  property?: IFieldProperty;
  scheme?: string;
  parentField?: IInputField;
  size?: "default" | "compact";
  isLabel?: boolean;
  isRequired?: boolean;
}

const scalars = [
  "text",
  "text-area",
  "date",
  "date-time",
  "rich-text",
  "number",
];

export const DocumentField = (props: IProps) => {
  const {
    field,
    root,
    prefix,
    isEditable,
    parentField,
    isLabel = true,
    size = "default",
    isRequired,
  } = props;

  let name = prefix ? `${prefix}.${field.name}` : field.name;
  if (scalars.includes(field.type)) name = root ? `${root}.${name}` : name;

  const updatedField = useMemo(
    () => ({
      ...field,
      name,
      label: isLabel ? field.label : undefined,
    }),
    [field, name],
  );

  switch (field.type) {
    case "text":
      return (
        <TextField
          field={updatedField}
          isEditable={isEditable}
          isRequired={isRequired}
        />
      );
    case "text-area":
      return (
        <TextAreaField
          field={updatedField}
          isEditable={isEditable}
          isRequired={isRequired}
        />
      );
    case "date":
      return (
        <DateField
          field={updatedField}
          isEditable={isEditable}
          parentField={parentField}
          isRequired={isRequired}
        />
      );
    case "date-time":
      return (
        <DateTimeField
          field={updatedField}
          isEditable={isEditable}
          parentField={parentField}
          isRequired={isRequired}
        />
      );
    case "rich-text":
      return (
        <RichTextAreaField
          field={updatedField}
          isEditable={isEditable}
          size={size}
          isRequired={isRequired}
        />
      );
    case "number":
      return (
        <NumberField
          field={updatedField}
          isEditable={isEditable}
          isRequired={isRequired}
        />
      );
    case "master-single":
      return (
        <MasterField
          field={updatedField}
          root={root}
          isEditable={isEditable}
          isRequired={isRequired}
        />
      );
    case "master-multi":
      return (
        <MasterField
          field={updatedField}
          isEditable={isEditable}
          root={root}
          isMulti={true}
          isRequired={isRequired}
        />
      );
    case "user-single":
      return <UserPickerField field={updatedField} isEditable={isEditable} />;
    case "user-multi":
      return (
        <UserPickerField
          field={updatedField}
          isEditable={isEditable}
          isMulti={true}
        />
      );
    case "group-single":
      return <GroupPickerField field={updatedField} isEditable={isEditable} />;
    case "group-multi":
      return (
        <GroupPickerField
          field={updatedField}
          isEditable={isEditable}
          isMulti={true}
        />
      );
    case "single-select":
      return (
        <SelectField
          field={updatedField}
          isEditable={isEditable}
          isRequired={isRequired}
        />
      );
    case "multi-select":
      return (
        <SelectField
          field={updatedField}
          isEditable={isEditable}
          isMulti={true}
          isRequired={isRequired}
        />
      );
    case "image-single":
      return (
        <SingleImageSelectField
          root={root}
          field={updatedField}
          isEditable={isEditable}
          size={size}
          isRequired={isRequired}
        />
      );
    case "image-multi":
      return (
        <MultiImageSelectField
          root={root}
          field={updatedField}
          isEditable={isEditable}
          size={size}
          isRequired={isRequired}
        />
      );
    case "attachment":
      return (
        <FileAttachementField
          root={root}
          field={updatedField}
          isEditable={isEditable}
          size={size}
          isRequired={isRequired}
        />
      );
    case "assignee":
      return (
        <AssigneePickerField
          root={root}
          field={updatedField}
          isEditable={isEditable}
          isRequired={isRequired}
        />
      );
    case "switch":
      return (
        <SwitchField
          field={updatedField}
          isEditable={isEditable}
          isRequired={isRequired}
        />
      );
    default:
      console.warn(`Field type ${updatedField.type} not supported`);
      return <></>;
  }
};
