import { Box } from "@chakra-ui/react";
import { flexRender } from "@tanstack/react-table";
import { Header, Row, SortDirection } from "@tanstack/table-core";
import { ChevronDown, ChevronUp } from "lucide-react";

export const sortRender = (direction: false | SortDirection) => {
  if (!direction) return null;
  if (direction === "asc")
    return (
      <ChevronUp
        size="1rem"
        style={{ minWidth: "1rem", alignSelf: "center" }}
        color="#42526E"
        strokeWidth="1.33"
        data-testid="sort-up"
      />
    );
  if (direction === "desc")
    return (
      <ChevronDown
        size="1rem"
        style={{ minWidth: "1rem", alignSelf: "center" }}
        color="#42526E"
        strokeWidth="1.33"
        data-testid="sort-down"
      />
    );
};

export const headerRender = <T extends { id: string | number }>(
  header: Header<T, unknown>,
  index: number,
  headers: Header<T, unknown>[],
  stickyCount: number,
  direction: "left" | "right" = "right",
) => {
  const isCheckboxHeader = header.column.id === "select";
  const isFirstCell = index === 0;
  const isPreviousCheckboxCell = headers[index - 1]?.column.id === "select";

  const isStickyRight =
    direction === "right" && headers.length - stickyCount <= index;
  const isStickyLeft = direction === "left" && index < stickyCount;

  // const right = isSticky
  //   ? `${headers[index + 1]?.getSize() ?? 0}rem`
  //   : undefined;

  let right = 0,
    left = 0;
  if (isStickyRight) {
    let i = index;
    while (headers[i + 1]) {
      right = right + headers[i + 1]?.column.getSize();
      i++;
    }
  } else {
    let i = index;
    while (headers[i - 1]) {
      left = left + headers[i - 1]?.column.getSize();
      i--;
    }
  }

  const isFirstSticky = stickyCount
    ? index ===
      (direction === "left" ? stickyCount - 1 : headers.length - stickyCount)
    : undefined;

  return (
    <Box
      key={header.id}
      fontFamily="heading"
      fontWeight="500"
      fontSize="small"
      color="gray.600"
      position={isStickyLeft || isStickyRight ? "sticky" : undefined}
      px={2}
      py={2}
      width={`${header.getSize()}rem`}
      minW={`${header.column.columnDef.minSize}rem`}
      maxW={`${header.column.columnDef.maxSize}rem`}
      borderLeft={
        direction === "left" || isFirstCell || isPreviousCheckboxCell
          ? "none"
          : "1px solid"
      }
      borderRight={
        direction === "right" || (isFirstCell && isCheckboxHeader)
          ? "none"
          : "1px solid"
      }
      borderColor={isFirstSticky ? "neutrals.400" : "neutrals.300"}
      mt={isCheckboxHeader ? 1 : 0}
      data-testid={`div-th-${header.column.id}`}
      flex="1 1 auto"
      right={isStickyRight ? `${right}rem` : undefined}
      left={isStickyLeft ? `${left}rem` : undefined}
      backgroundColor="#F7F8F9"
    >
      {header.isPlaceholder ? null : (
        <Box
          // cursor="pointer"
          // onClick={header.column.getToggleSortingHandler()}
          display="flex"
          flexDirection="row"
          gap={2}
          data-testid={`sort-${header.column.columnDef.id}`}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          {/* {sortRender(header.column.getIsSorted())} */}
        </Box>
      )}
      {false && header.column.getCanResize() && (
        <Box
          position="absolute"
          top={0}
          right={0}
          h="full"
          w="2"
          cursor={"col-resize"}
          userSelect="none"
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={`resizer ${
            header.column.getIsResizing() ? "isResizing" : ""
          }`}
          data-testid={`header-resizer-${header.column.id}`}
        />
      )}
    </Box>
  );
};

export const rowRender = <T extends { id: string | number }>(
  row: Row<T>,
  stickyCount: number,
  onInvoked?: (row: T, index: number) => void,
  isPointer?: boolean,
  direction: "left" | "right" = "right",
  rows?: Row<T>[],
  mergeCellAccessor?: (row: T) => string | undefined,
  getMergeCellSequence?: (sequence?: string) => string,
  getFieldValue?: (cell: any, key: string) => any,
  rowStyle?: any,
) => {
  const rowMergeMap = new Map<
    string,
    { rowSpan: number; isRowSpanned: boolean }
  >();

  rows?.forEach((row, index) => {
    row.getVisibleCells().forEach((cell, cellIndex) => {
      const previousRow = rows?.[index - 1];
      const topCell = previousRow?.getVisibleCells()[cellIndex];

      const currentMergeCell = getMergeCellSequence?.(
        mergeCellAccessor?.(row.original),
      );
      const previousMergeCell = getMergeCellSequence?.(
        mergeCellAccessor?.(previousRow?.original as T),
      );

      const columnId = cell?.column?.columnDef?.id ?? "";
      const key = (columnId.split(":")[1] || columnId)?.toLowerCase();

      const topCellValue = topCell ? getFieldValue?.(topCell, key) : undefined;
      const currentCellValue = getFieldValue?.(cell, key);

      const isMergingAllowed =
        topCell &&
        !previousRow?.getIsGrouped() &&
        !row.getIsGrouped() &&
        topCellValue &&
        currentCellValue &&
        JSON.stringify(topCellValue) === JSON.stringify(currentCellValue) &&
        currentMergeCell &&
        previousMergeCell &&
        currentMergeCell === previousMergeCell;

      rowMergeMap.set(cell.id, {
        rowSpan: isMergingAllowed
          ? (rowMergeMap.get(topCell?.id)?.rowSpan || 1) + 1
          : 1,
        isRowSpanned: isMergingAllowed,
      });
    });
  });

  return (
    <Box
      key={row.id}
      display="flex"
      flexDirection="row"
      onDoubleClick={() => onInvoked?.(row.original, row.index)}
      role="group"
      data-testid={`div-row-${row.id}`}
    >
      {row.getVisibleCells().map((cell: any, cellIndex) => {
        const isCheckboxCell = cell.column.id === "select";
        const isPreviousCheckboxCell =
          row.getVisibleCells()[cellIndex - 1]?.column.id === "select";
        const isFirstCell = cellIndex === 0;

        const isStickyLeft = direction === "left" && cellIndex < stickyCount;
        const isStickyRight =
          direction === "right" &&
          row.getVisibleCells().length - stickyCount <= cellIndex;

        let left = 0,
          right = 0;
        if (isStickyRight) {
          let i = cellIndex;
          while (row.getVisibleCells()[i + 1]) {
            right = right + row.getVisibleCells()[i + 1]?.column.getSize();
            i++;
          }
        } else {
          let i = cellIndex;
          while (row.getVisibleCells()[i - 1]) {
            left = left + row.getVisibleCells()[i - 1]?.column.getSize();
            i--;
          }
        }

        const isFirstSticky =
          direction === "left"
            ? cellIndex === stickyCount - 1
            : direction === "right"
            ? cellIndex === row.getVisibleCells().length - stickyCount
            : false;

        const nextCell = rows?.[row.index + 1]?.getVisibleCells()[cellIndex];
        const nextCellRowSpan: any = nextCell
          ? rowMergeMap.get(nextCell.id)?.rowSpan
          : undefined;
        const isRowSpanned = rowMergeMap.get(cell.id)?.isRowSpanned;

        return (
          <Box
            key={cell.id}
            overflow="hidden"
            textOverflow="ellipsis"
            px={2}
            py={2}
            pt={isCheckboxCell ? 2.5 : 2}
            width={`${cell.column.getSize()}rem`}
            minW={`${cell.column.columnDef.minSize}rem`}
            maxW={`${cell.column.columnDef.maxSize}rem`}
            borderLeft={
              direction === "left" || isPreviousCheckboxCell || isFirstCell
                ? "none"
                : "1px solid"
            }
            borderRight={
              direction === "right" || (isFirstCell && isCheckboxCell)
                ? "none"
                : "1px solid"
            }
            borderColor={isFirstSticky ? "neutrals.400" : "neutrals.300"}
            data-testid={`div-td-${cell.column.id}`}
            borderBottom={nextCellRowSpan > 1 ? "none" : "1px solid"}
            borderBottomColor="neutrals.300"
            flex="1 1 auto"
            _groupHover={{ bg: "blue.100" }}
            position={isStickyLeft || isStickyRight ? "sticky" : undefined}
            left={direction === "left" ? `${left}rem` : undefined}
            right={direction === "right" ? `${right}rem` : undefined}
            cursor={isPointer ? "pointer" : "default"}
            color={rowStyle?.color ?? undefined}
            background={rowStyle?.background ?? "white"}
            opacity={rowStyle?.opacity ?? undefined}
          >
            {!isRowSpanned &&
              flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Box>
        );
      })}
    </Box>
  );
};
