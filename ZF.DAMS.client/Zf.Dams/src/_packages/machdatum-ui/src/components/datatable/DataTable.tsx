import {
  Box,
  Flex,
  IconButton,
  LayoutProps,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  TypographyProps,
  Alert,
  Stack,
  Icon,
  Text,
} from "@chakra-ui/react";
import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { AlertTriangle, MoreVertical } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { headerRender, rowRender } from "./renderDiv";
import _ from "lodash";
import BulkActions from "./BulkActions";
import Footer from "./Footer";

interface IProps<T> {
  data: T[] | undefined;
  count?: number | undefined;
  columns: Array<ColumnDef<T, any>>;
  paginationText?: string;
  defaultPageSize?: number;
  isLoading?: boolean;
  isError?: boolean;
  isPointer?: boolean;
  onPagination?: (params: PaginationState) => void;
  onSorting?(columns: { id: keyof T; desc: boolean }[] | undefined): void;
  onInvoked?(row: T, index: number): void;
  onItemsSelected?(rows: string[] | number[]): void;
  menu?: (row: T) => ReactNode;
  bulkActions?: (selectedRowItems: string[]) => ReactNode;
  defaultSorting?: {
    field: string;
    direction: string;
  }[];
  stickyCount?: number;
  stickyColumnsDirection?: "right" | "left";
  rowRender?: (
    row: Row<T>,
    stickyCount: number,
    onInvoked?: (row: T, index: number) => void,
    isPointer?: boolean,
  ) => ReactNode;
  mergeCellAccessor?: (row: T) => string | undefined;
  getMergeCellSequence?: (sequence?: string) => string;
  getFieldValue?: (cell: any, key: string) => any;
  getRowStyle?: (row: T) => any | undefined;
}

function DataTable<T extends { id: string | number }>(
  props: IProps<T> & LayoutProps & TypographyProps,
) {
  const {
    data,
    columns,
    count,
    paginationText,
    defaultPageSize,
    onInvoked,
    onPagination,
    onItemsSelected,
    onSorting,
    isLoading,
    isError = false,
    isPointer,
    menu,
    bulkActions,
    defaultSorting,
    stickyCount = 0,
    stickyColumnsDirection,
    rowRender: overrideRowRender,
    mergeCellAccessor,
    getMergeCellSequence,
    getFieldValue,
    getRowStyle,
  } = props;

  const [pageCount, setPageCount] = useState<number>();

  const menuColumn: ColumnDef<T> | null = !menu
    ? null
    : {
        id: "menu",
        cell: ({ row }) => (
          <Box
            display="flex"
            justifyContent="flex-end"
            px={4}
            data-testid={`context-menu`}
          >
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={
                  <MoreVertical
                    size="1rem"
                    color="#42526E"
                    strokeWidth="1.33"
                  />
                }
                variant="outline"
                border="none"
                _hover={{ bg: "neutrals.300" }}
                _expanded={{ bg: "neutrals.200" }}
                px={1}
              />
              <MenuList>{menu(row.original)}</MenuList>
            </Menu>
          </Box>
        ),
        size: 50,
        maxSize: 50,
        minSize: 50,
      };

  const table = useReactTable({
    data: data || [],
    columns: (menuColumn ? [...columns, menuColumn] : columns).filter(
      (x) => !!x,
    ),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableSorting: true,
    manualSorting: true,
    enableSortingRemoval: true,
    columnResizeMode: "onChange",
    initialState: {
      pagination: {
        pageSize: defaultPageSize ?? 10,
        pageIndex: 0,
      },
    },
    getRowId: (row) => row?.id?.toString(),
    defaultColumn: {
      size: 6,
      minSize: 6,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });
  const { pagination, rowSelection, sorting } = table.getState();

  useEffect(() => {
    onPagination?.(pagination);
  }, [pagination, onPagination]);

  useEffect(() => {
    if (!!count) setPageCount(Math.ceil(count / pagination.pageSize));
  }, [count, pagination.pageSize]);

  useEffect(() => {
    onItemsSelected?.(Object.keys(rowSelection));
  }, [rowSelection, onItemsSelected]);

  useEffect(() => {
    const sorting =
      defaultSorting?.map((s) => ({
        id: s.field,
        desc: s.direction === "descending" ? true : false,
      })) ?? [];
    table.setState((state) => {
      return {
        ...state,
        sorting: sorting,
      };
    });
  }, [defaultSorting]);

  useEffect(() => {
    onSorting?.(
      sorting.length
        ? [
            {
              id: sorting[0].id as keyof T,
              desc: sorting[0].desc,
            },
          ]
        : undefined,
    );
  }, [sorting, onSorting]);

  const isBulkActions = Object.keys(rowSelection).length > 0;

  return (
    <Flex
      h="100dvh"
      w="97.5dvw"
      overflow="hidden"
      direction="column"
      gap={4}
      data-testid="datatable"
      id="data-table"
      {...(props as LayoutProps)}
      {...(props as TypographyProps)}
    >
      <Flex
        h="full"
        overflow="hidden"
        flexDirection="column"
        border="1px solid"
        borderColor="neutrals.300"
        borderRadius="base"
      >
        <Box h="full" display="flex" flexDirection="column" overflow="auto">
          <Box
            backgroundColor="#F7F8F9"
            minW={"fit-content"}
            position="sticky"
            top={0}
            zIndex={1}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <Flex
                className="Tr"
                key={headerGroup.id}
                borderBottom="1px solid"
                borderBottomColor="neutrals.200"
              >
                {headerGroup.headers.map((header, index, headers) =>
                  headerRender(
                    header,
                    index,
                    headers,
                    stickyCount,
                    stickyColumnsDirection,
                  ),
                )}
              </Flex>
            ))}
          </Box>
          <Box
            className="Tbody"
            style={{ flex: 1, width: "100%", borderCollapse: "collapse" }}
            minW={"fit-content"}
          >
            {isLoading ? (
              _.range(0, 3).map((i) => (
                <Box className="Tr" key={i}>
                  <Box className="Td">
                    <Skeleton h={3} />
                  </Box>
                </Box>
              ))
            ) : isError ? (
              <Stack
                width="100%"
                height="100dvh"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-end"
                pb="20px"
              >
                <Alert
                  status="error"
                  width="90%"
                  maxWidth="350px"
                  borderRadius="md"
                  p="2"
                  boxShadow="lg"
                  bg="red.600"
                  color="white"
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={AlertTriangle} fontSize="20px" mr="3" />
                  <Text flex="1">
                    There was an error in processing your request
                  </Text>
                </Alert>
              </Stack>
            ) : data?.length === 0 ? (
              <Flex
                justifyContent={"center"}
                alignItems={"flex-start"}
                h="full"
                w="full"
              >
                <Text fontSize={"2xl"} mt={4} color={"neutrals.400"}>
                  No {paginationText} found
                </Text>
              </Flex>
            ) : (
              table
                .getRowModel()
                .rows.map((row, _index, rows) =>
                  (overrideRowRender ?? rowRender)(
                    row,
                    stickyCount,
                    onInvoked,
                    isPointer,
                    stickyColumnsDirection,
                    rows,
                    mergeCellAccessor,
                    getMergeCellSequence,
                    getFieldValue,
                    getRowStyle?.(row.original),
                  ),
                )
            )}
          </Box>
        </Box>
        {isBulkActions && bulkActions && (
          <BulkActions
            selectedRowItems={rowSelection}
            bulkActionsText={paginationText}
          >
            {bulkActions(Object.keys(rowSelection))}
          </BulkActions>
        )}
      </Flex>
      {onPagination && (
        <Footer
          pagination={pagination}
          table={table}
          count={count || 0}
          paginationText={paginationText || ""}
        />
      )}
    </Flex>
  );
}

export default DataTable;
