import { Box, HStack, Link } from "@chakra-ui/react";
import { chakraComponents, MenuListProps } from "chakra-react-select";
import { useRef } from "react";
import { List } from "react-virtualized";

const isGroup = (option: any) => "options" in option;

const MenuListVirtualized = (props: MenuListProps) => {
  const { children, clearValue, isMulti, options, setValue, selectProps } =
    props;

  const parentRef = useRef<HTMLDivElement>(null);
  const items = Array.isArray(children) ? children : [children];

  const getItemCount = (item: any) => {
    const children = item?.props?.children;
    return Array.isArray(children) ? children.length + 1 : 1;
  };

  const rowRenderer = ({
    key,
    index,
    style,
  }: {
    key: string;
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = items[index];
    if (!item) return null;

    return (
      <Box key={key} style={style}>
        {item}
      </Box>
    );
  };

  return (
    <chakraComponents.MenuList
      {...props}
      selectProps={{
        ...selectProps,
        chakraStyles: {
          menuList: (provided) => ({
            ...provided,
            scrollbarWidth: "none",
          }),
        },
      }}
      innerRef={parentRef}
    >
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
      <List
        rowCount={items?.length ?? 0}
        rowHeight={({ index }) => getItemCount(items[index]) * 33}
        width={parentRef.current?.scrollWidth || 350}
        height={Math.min(
          items.reduce((sum, item) => sum + getItemCount(item) * 33, 0),
          260,
        )}
        rowRenderer={rowRenderer}
        overscanRowCount={2}
      />
    </chakraComponents.MenuList>
  );
};

export default MenuListVirtualized;
