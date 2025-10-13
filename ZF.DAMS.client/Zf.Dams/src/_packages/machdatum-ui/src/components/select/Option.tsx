import { OptionProps } from "chakra-react-select";
import {
  Box,
  CheckboxIcon,
  Flex,
  chakra,
  useMultiStyleConfig,
} from "@chakra-ui/react";

const Option = (props: OptionProps) => {
  const { children, innerRef, innerProps, isSelected, isFocused, isMulti } =
    props;

  return (
    <Flex
      ref={innerRef}
      {...innerProps}
      px={2}
      py={1.5}
      alignItems={"center"}
      display={"flex"}
      position={"relative"}
      cursor={"default"}
      userSelect={"none"}
      borderRadius={"base"}
      _hover={{ bg: "gray.100" }}
      bg={isFocused ? "gray.100" : "transparent"}
      onClick={() => props.selectOption(props.data)}
    >
      {isMulti ? <Checkbox isChecked={isSelected} /> : <></>}
      <Box ml={2}>{children}</Box>
    </Flex>
  );
};

function Checkbox({ isChecked }: { isChecked: boolean }) {
  const styles = useMultiStyleConfig("Checkbox");

  return (
    <chakra.span
      __css={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "top",
        userSelect: "none",
        flexShrink: 0,
        ...styles.control,
      }}
      data-checked={isChecked ? "" : undefined}
      className="chakra-checkbox__control"
    >
      <CheckboxIcon __css={styles.icon} isChecked={isChecked} />
    </chakra.span>
  );
}

export default Option;
