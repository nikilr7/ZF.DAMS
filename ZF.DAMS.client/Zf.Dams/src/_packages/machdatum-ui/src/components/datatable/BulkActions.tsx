import { Flex, Spacer, Box } from "@chakra-ui/react";

interface IProps {
  selectedRowItems: object;
  bulkActionsText?: string;
}

const BulkActions = (props: React.PropsWithChildren<IProps>) => {
  const { selectedRowItems, bulkActionsText } = props;
  const selectedCount = Object.keys(selectedRowItems).length;

  return (
    <Flex
      bg={"neutrals.200"}
      borderRadius={"base"}
      borderColor={"neturals.100"}
      h={12}
    >
      <Box
        p={4}
        fontWeight="medium"
      >{`${selectedCount} ${bulkActionsText} Selected`}</Box>
      <Spacer />
      {props.children}
    </Flex>
  );
};

export default BulkActions;
