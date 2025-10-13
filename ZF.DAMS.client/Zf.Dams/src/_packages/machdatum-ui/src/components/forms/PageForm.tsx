import { memo, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { IFormWrapper } from "./Form";

function withPageForm<T>(Component: React.ComponentType<T>) {
  return memo(function FormWrapper(props: T) {
    const Wrapper = useMemo(
      () => (p: IFormWrapper) => {
        return <Box h="full" {...p} {...props} title={undefined} />;
      },
      [],
    );

    return <Component Wrapper={Wrapper} {...props} />;
  });
}

export default withPageForm;
