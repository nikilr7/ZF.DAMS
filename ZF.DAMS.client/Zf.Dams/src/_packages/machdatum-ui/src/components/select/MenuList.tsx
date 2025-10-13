import { HStack, Link } from "@chakra-ui/react";
import { chakraComponents, MenuListProps } from "chakra-react-select";

const isGroup = (option: any) => "options" in option;

const MenuList = (props: MenuListProps) => {
  const { children, clearValue, isMulti, options, setValue } = props;

  return (
    <chakraComponents.MenuList {...props}>
      {isMulti && (
        <HStack
          gap={4}
          justifyContent={"flex-start"}
          px={2}
          pb={1}
          fontSize={"xs"}
        >
          <Link
            color={"blue.700"}
            onClick={() => {
              if (options.length > 0 && isGroup(options[0])) {
                setValue(
                  options.flatMap((option: any) => option.options),
                  "select-option",
                );
              } else {
                setValue(options, "select-option");
              }
            }}
          >
            Select All
          </Link>
          <Link color={"blue.700"} onClick={clearValue}>
            Clear
          </Link>
        </HStack>
      )}
      {children}
    </chakraComponents.MenuList>
  );
};

export default MenuList;
