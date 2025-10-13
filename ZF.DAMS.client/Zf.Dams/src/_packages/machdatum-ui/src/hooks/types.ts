import { Predicate } from "@syncfusion/ej2-data";
import { UseQueryResult } from "@tanstack/react-query";
import { QueryResponse } from "./useDataManager";
import { AxiosError } from "axios";

export interface DataManagerProps<T> {
  isPagination?: boolean;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  search?: {
    input?: string;
    fields: string[];
  };
  filters?: Predicate[];
  sorting?: {
    id: keyof T;
    desc: boolean;
  }[];
  isEnabled?: boolean;
}

export interface DataManagerResponse<T> {
  result: UseQueryResult<QueryResponse<T>, AxiosError<any>>;
  setPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
  setSorting: React.Dispatch<
    React.SetStateAction<
      | {
          id: keyof T;
          desc: boolean;
        }[]
      | undefined
    >
  >;
  setFilters: React.Dispatch<React.SetStateAction<Predicate[] | undefined>>;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
}
