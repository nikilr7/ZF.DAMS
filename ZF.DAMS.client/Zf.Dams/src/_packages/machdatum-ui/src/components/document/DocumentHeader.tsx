import { Box, HStack, Text } from "@chakra-ui/react";
import { IDocument } from "../../hooks/defs";
import { IDocumentConfiguration, ITransition } from "../../hooks/useDocument";
import TransitionButton from "./TransitionButton";

interface IProps {
  document?: IDocument;
  configuration?: IDocumentConfiguration;
  transitions?: ITransition[];
  handleTransition: (transition: ITransition) => void;
}

export default function DocumentHeader(props: IProps) {
  const { document, configuration, transitions, handleTransition } = props;

  const statuses = configuration?.statuses ?? [];
  const currentIndex = statuses.findIndex(
    (status) => status.name === (document?.status ?? ""),
  );

  return (
    <>
      <HStack>
        {statuses.map((status, index) => (
          <Box
            key={status.name}
            py={1}
            flex={"1 1 auto"}
            w="1px"
            borderRadius={"base"}
            textAlign={"center"}
            color={
              index === currentIndex
                ? "white"
                : index < currentIndex
                ? "white"
                : "inherit"
            }
            bg={
              index === currentIndex
                ? "green.800"
                : index < currentIndex
                ? "green.600"
                : "neutrals.300"
            }
          >
            <Text
              fontSize={"xs"}
              fontWeight={
                index === currentIndex
                  ? "medium"
                  : index < currentIndex
                  ? "normal"
                  : "normal"
              }
            >
              {status.label}
            </Text>
          </Box>
        ))}
      </HStack>
      {(transitions ?? []).length > 0 && (
        <HStack my={4}>
          {transitions?.map((t) => (
            <TransitionButton
              key={t.name}
              transition={t}
              onClick={() => handleTransition(t)}
            />
          ))}
        </HStack>
      )}
    </>
  );
}
