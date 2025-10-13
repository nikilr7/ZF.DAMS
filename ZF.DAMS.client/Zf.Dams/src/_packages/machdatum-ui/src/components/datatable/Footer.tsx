import { Box, Flex, Select, Text, useBreakpointValue } from "@chakra-ui/react";
import { PaginationState, Table } from "@tanstack/table-core";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function Footer({
  pagination,
  table,
  count,
  paginationText,
}: {
  pagination: PaginationState;
  table: Table<any>;
  count: number;
  paginationText: string;
}) {
  const startRange = pagination.pageIndex * pagination.pageSize + 1;
  const endRange = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    count,
  );
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const displayPaginationText = isLargeScreen ? `${paginationText}` : "";

  return (
    <Flex
      width="full"
      alignSelf="stretch"
      alignItems="center"
      justifyContent="space-between"
      data-testid="footer"
      p={0.25}
    >
      <Flex alignItems={"center"}>
        <Select
          value={pagination.pageSize}
          size={"sm"}
          width={20}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          data-testid="select-pageSize"
        >
          {[10, 25, 50, 100, 250, 500, 1000].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Select>
        <Text fontSize={{ base: "12", sm: "14" }} lineHeight="shorter" pl={2.5}>
          {displayPaginationText} per page
        </Text>
      </Flex>
      <Box
        lineHeight="shorter"
        fontSize={{ base: "12", sm: "14" }}
        textAlign="center"
      >
        {`${startRange}-${endRange} of ${count} ${displayPaginationText}`}
      </Box>
      <Box justifyContent="flex-end" display="flex" alignItems="center" gap={2}>
        <ChevronsLeft
          size="21px"
          color={table.getCanPreviousPage() ? "#42526E" : "#B3B9C4"}
          strokeWidth="1.33"
          onClick={() => table.setPageIndex(0)}
          cursor={table.getCanPreviousPage() ? "pointer" : "default"}
          data-testid="first-page"
        />
        <ChevronLeft
          size="18px"
          color={table.getCanPreviousPage() ? "#42526E" : "#B3B9C4"}
          strokeWidth="1.33"
          aria-disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          cursor={table.getCanPreviousPage() ? "pointer" : "default"}
          data-testid="previous-page"
        />
        <ChevronRight
          size="18px"
          color={table.getCanNextPage() ? "#42526E" : "#B3B9C4"}
          strokeWidth="1.33"
          aria-disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          cursor={table.getCanNextPage() ? "pointer" : "default"}
          data-testid="next-page"
        />
        <ChevronsRight
          size="21px"
          color={table.getCanNextPage() ? "#42526E" : "#B3B9C4"}
          strokeWidth="1.33"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          cursor={table.getCanNextPage() ? "pointer" : "default"}
          data-testid="last-page"
        />
      </Box>
    </Flex>
  );
}
