import { ReactNode } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Fade,
  Stack,
} from "@chakra-ui/react";

function Footer({
  children,
  error,
  direction = "rtl",
}: {
  children: ReactNode;
  error?: boolean | string;
  direction?: "rtl" | "ltr";
}) {
  return (
    <Stack
      w="full"
      spacing={2}
      direction={direction === "rtl" ? "row-reverse" : "row"}
      justifyContent={"flex-start"}
    >
      {error ? (
        <Fade in={true}>
          <Alert data-testid="error" status="error">
            <AlertIcon />
            <AlertDescription noOfLines={1}>{error}</AlertDescription>
          </Alert>
        </Fade>
      ) : (
        children
      )}
    </Stack>
  );
}

export default Footer;
