import { Props, Select as ReactSelect } from "chakra-react-select";
import Option from "./Option";
import ValueContainer from "./ValueContainer";
import MenuList from "./MenuList";

function Select<T = any>(props: Props<T>) {
  const { isMulti } = props;

  return (
    <ReactSelect
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
      {...(props as Props)}
      hideSelectedOptions={false}
      closeMenuOnSelect={isMulti ? false : true}
      components={{ Option, ValueContainer, MenuList }}
      menuPlacement="auto"
    />
  );
}

export default Select;
