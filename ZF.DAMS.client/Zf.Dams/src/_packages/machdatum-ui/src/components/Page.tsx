import {
  Breadcrumb,
  Flex,
  Box,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  HStack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { CloudOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentContext } from "../context/DocumentConfigurationContext";

export interface IProps {
  title?: string | React.ReactNode;
  description?: string;
  isLoading?: boolean;
  breadcrumbs?: (string | null | undefined)[];
  tos?: string[];
  actions?: React.ReactNode;
}

const Page = (props: React.PropsWithChildren<IProps>) => {
  const { title, breadcrumbs, description, tos, isLoading, actions } = props;

  const getLink = (index: number) => {
    if (tos?.[index] !== undefined) return tos[index];
    return breadcrumbs?.slice(0, index + 1).join("/") ?? "";
  };
  const { isOfflineMode } = useDocumentContext();

  return (
    <Flex
      direction={"column"}
      w="100dvw"
      h="100dvh"
      gap={4}
      py={4}
      overflow={"hidden"}
      id="page-container"
    >
      <Flex direction={"column"} px={6}>
        <Breadcrumb>
          {breadcrumbs?.map((p, index) =>
            p ? (
              <BreadcrumbItem
                key={index}
                isCurrentPage={index === breadcrumbs.length - 1}
              >
                <BreadcrumbLink as={Link} to={"/" + getLink(index)}>
                  {p}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ) : null,
          )}
        </Breadcrumb>
        <Flex direction="row" alignItems="center" gap={2}>
          <HStack flex={1}>
            {title &&
              (typeof title === "string" ? (
                <Heading variant={"H700"}>{title}</Heading>
              ) : (
                title
              ))}
            {isLoading && <Spinner size={"sm"} />}
            {isOfflineMode && (
              <Box
                bg="neutrals.200"
                color="neutrals.800"
                px={2}
                py={0.5}
                h={6}
                borderRadius="base"
                fontSize="13px"
                fontWeight="semibold"
                display="flex"
                justifyContent="center"
                alignItems="center"
                w="fit-content"
                isTruncated
                gap={2}
                cursor={"default"}
              >
                <Text>Offline Mode</Text>
                <CloudOff size={"1rem"} color="#42526E" strokeWidth="1.33" />
              </Box>
            )}
          </HStack>
          {actions && <HStack>{actions}</HStack>}
        </Flex>
        {description && (
          <Text fontSize={"sm"} color={"neutrals.700"} py={2}>
            {description}
          </Text>
        )}
      </Flex>
      <Box px={6} flex={"1 1 auto"} overflow={"auto"}>
        {props.children}
      </Box>
    </Flex>
  );
};

export default Page;
