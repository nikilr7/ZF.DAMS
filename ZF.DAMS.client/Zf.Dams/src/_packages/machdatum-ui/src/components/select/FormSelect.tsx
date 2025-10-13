import { GroupBase, OptionsOrGroups, Props, Select } from "chakra-react-select";
import {
  ControllerRenderProps,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import Option from "./Option";
import ValueContainer from "./ValueContainer";
import MenuListVirtualized from "./MenuListVirtualized";
import MenuList from "./MenuList";
import { memo, useState } from "react";

interface IFormProps {
  field: ControllerRenderProps<FieldValues, string>;
  isVirtualised?: boolean;
}

function PrimaryFormSelect<T>(
  props: UseControllerProps & IFormProps & Props<T>,
) {
  const { field, isMulti, isVirtualised = false, options = [] } = props;

  const [reorderedOptions, setReorderedOptions] =
    useState<OptionsOrGroups<T, GroupBase<T>>>(options);

  const handleMenuOpen = () => {
    const selected = isMulti && Array.isArray(field.value) ? field.value : [];
    const selectedIds = new Set(selected.map((s) => s.id));

    setReorderedOptions([
      ...selected,
      ...options.filter((opt: any) => !selectedIds.has(opt.id)),
    ]);
  };

  return (
    <Select
      size={"compact" as any}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (provided: any) => ({ ...provided, zIndex: 1500 }),
      }}
      chakraStyles={{
        dropdownIndicator: (provided: any, _state: any) => ({
          ...provided,
          backgroundColor: "transparent",
        }),
        clearIndicator: (provided: any, _state: any) => ({
          ...provided,
          mr: 2,
        }),
        crossIcon: (provided: any, _state: any) => ({
          ...provided,
          w: 2,
          h: 2,
        }),
      }}
      {...field}
      {...(props as Props)}
      options={reorderedOptions}
      onMenuOpen={handleMenuOpen}
      hideSelectedOptions={false}
      closeMenuOnSelect={isMulti ? false : true}
      components={{
        Option,
        ValueContainer,
        ...(isVirtualised ? { MenuListVirtualized } : { MenuList }),
      }}
      menuPlacement="auto"
    />
  );
}

const MemoFormSelect = memo(PrimaryFormSelect) as typeof PrimaryFormSelect;

function FormSelect<T>(props: UseControllerProps & Props<T>) {
  const { field } = useController(props as UseControllerProps);
  return <MemoFormSelect field={field} {...props} />;
}

function FormSelectVirtualized<T>(props: UseControllerProps & Props<T>) {
  const { field } = useController(props as UseControllerProps);
  return <MemoFormSelect field={field} isVirtualised={true} {...props} />;
}

export default FormSelect;
export { FormSelectVirtualized };
