import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { IFormWrapper } from "./Form";

const BasicForm = (props: IFormWrapper) => {
  const { title, description, footer, children, isLoading } = props;

  return (
    <Box maxW={"sm"}>
      <Heading variant={"H600"}>
        {title}
        {description && (
          <Text fontSize={"xs"} color={"neutrals.500"} py={2}>
            {description}
          </Text>
        )}
        {isLoading && <Spinner ml={2} size={"xs"} />}
      </Heading>
      <Box mt={6}>{children}</Box>
      <Box mt={6}>{footer("ltr")}</Box>
    </Box>
  );
};

function withBasicForm<T>(Component: React.ComponentType<T>) {
  return function FormWrapper(props: T) {
    return <Component Wrapper={BasicForm} {...props} />;
  };
}

export default withBasicForm;
