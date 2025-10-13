import { ValueContainerProps, MultiValue } from "chakra-react-select";
import { Box, Flex, Text } from "@chakra-ui/react";

const ValueContainer = (props: ValueContainerProps) => {
  const { getValue, children } = props;

  const values: MultiValue<any> = getValue();
  const valueLabels = values
    .map((option) => props.selectProps.getOptionLabel(option))
    .join(", ");

  return (
    <Flex flex="1 1" px={1.5} alignItems={"center"} overflow={"hidden"}>
      <Box ml={"-2px"}>{Array.isArray(children) ? children[1] : children}</Box>
      <Text ml={"-6px"} noOfLines={1}>
        {!props.selectProps.inputValue && valueLabels}
      </Text>
    </Flex>
  );
};

export default ValueContainer;
