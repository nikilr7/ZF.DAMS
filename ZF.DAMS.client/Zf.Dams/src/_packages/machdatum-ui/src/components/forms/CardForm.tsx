import { IFormWrapper } from "./Form";
import Configuration from "../Configuration";
import { Spinner, Text } from "@chakra-ui/react";

const CardForm = (props: IFormWrapper) => {
  const { title, description, footer, children, isLoading } = props;

  return (
    <Configuration.Card>
      <Configuration.Header>
        {title}
        {description && (
          <Text fontSize={"xs"} color={"neutrals.500"} py={2}>
            {description}
          </Text>
        )}
        {isLoading && <Spinner ml={2} size={"xs"} />}
      </Configuration.Header>
      <Configuration.Body>{children}</Configuration.Body>
      <Configuration.Footer>{footer("ltr")}</Configuration.Footer>
    </Configuration.Card>
  );
};

function withCardForm<T>(Component: React.ComponentType<T>) {
  return function FormWrapper(props: T) {
    return <Component Wrapper={CardForm} {...props} />;
  };
}

export default withCardForm;
