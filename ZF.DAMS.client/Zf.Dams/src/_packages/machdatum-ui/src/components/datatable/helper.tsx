import { Checkbox, Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { AccessorFn } from "@tanstack/react-table";
import { ColumnDef, RowData, createColumnHelper } from "@tanstack/table-core";

export function link<T>(
  accessor: keyof T | AccessorFn<T>,
  to: (data: T) => string,
  options: { id?: string; header: string } | undefined = undefined,
) {
  const helper = createColumnHelper<T>();
  let column: ColumnDef<T, T[keyof T]>;

  if (typeof accessor === "function") {
    column = helper.accessor(accessor, {
      id: options?.id,
      header: options?.header ?? camelCaseToText(options?.id as string),
    });
  } else {
    column = helper.accessor((data: T) => data[accessor], {
      id: accessor as string,
      header: options?.header ?? camelCaseToText(accessor as string),
      cell: (info) => {
        return (
          <Link
            as={ReactRouterLink}
            to={to(info.cell.row as T)}
            color={"blue.700"}
          >
            {info.getValue() as any}
          </Link>
        );
      },
      size: 12,
    });
  }

  return column;
}

export function getSelectColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        isChecked={table.getIsAllRowsSelected()}
        onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
        role="checkbox-header"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        isChecked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
        role="checkbox-cell"
      />
    ),
    size: 2.25,
    minSize: 2.25,
    maxSize: 2.25,
    enableSorting: false,
    enableResizing: false,
  };
}

export default function tableHelper<T extends RowData>(
  isSelect: boolean = true,
) {
  const helper = createColumnHelper<T>();
  const columns: ColumnDef<T, T[keyof T]>[] = [];

  if (isSelect) columns.push(getSelectColumn<T>());

  function link(
    accessor: keyof T | AccessorFn<T>,
    to: (data: T) => string,
    options: { id?: string; header: string } | undefined = undefined,
  ) {
    let column: ColumnDef<T, T[keyof T]>;

    if (typeof accessor === "function") {
      column = helper.accessor(accessor, {
        id: options?.id,
        header: options?.header ?? camelCaseToText(options?.id as string),
      });
    } else {
      column = helper.accessor((data: T) => data[accessor], {
        id: accessor as string,
        header: options?.header ?? camelCaseToText(accessor as string),
        cell: (info) => {
          return (
            <Link
              as={ReactRouterLink}
              to={to(info.cell.row as T)}
              color={"blue.700"}
            >
              {info.getValue() as any}
            </Link>
          );
        },
      });
    }

    columns.push(column);
  }

  function accessor(
    accessor: keyof T | AccessorFn<T>,
    options: { id?: string; header: string } | undefined = undefined,
  ) {
    let column: ColumnDef<T, T[keyof T]>;

    if (typeof accessor === "function") {
      column = helper.accessor(accessor, {
        id: options?.id,
        header: options?.header ?? camelCaseToText(options?.id as string),
      });
    } else {
      column = helper.accessor((data: T) => data[accessor], {
        id: accessor as string,
        header: options?.header ?? camelCaseToText(accessor as string),
      });
    }

    columns.push(column);
  }

  return {
    accessor,
    link,
    columns,
    internalHelper: helper,
  };
}

function camelCaseToText(text: string) {
  return text.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}
