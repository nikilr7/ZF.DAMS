import {
  DataManager,
  Predicate,
  Query,
  UrlAdaptor,
} from "@syncfusion/ej2-data";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataManagerProps } from "./types";
import axios, { AxiosError } from "axios";

export interface QueryResponse<T> {
  result: T[];
  count: number;
}

function useDataManager<T>(
  key: string,
  endpoint: string,
  props: DataManagerProps<T> = {},
) {
  const [search, setSearch] = useState<string>();
  const [filters, setFilters] = useState<Predicate[] | undefined>(
    props.filters,
  );

  useEffect(() => {
    setFilters(props.filters);
  }, [props.filters]);

  const isEnabled = props.isEnabled ?? true;

  const [pagination, setPagination] = useState(
    props.pagination || {
      pageIndex: 0,
      pageSize: 0,
    },
  );

  const [sorting, setSorting] = useState<
    | {
        id: keyof T;
        desc: boolean;
      }[]
    | undefined
  >(props.sorting);

  const manager = useRef<DataManager>(
    new DataManager({
      adaptor: new UrlAdaptor(),
      url: endpoint,
      headers: [
        {
          Authorization: axios.defaults.headers.common["Authorization"],
        },
      ],
      offline: false,
    }),
  );

  const query = useMemo<Query>(() => {
    let query = new Query();

    if (!props.isPagination) {
      query = query
        .take(pagination.pageSize)
        .skip(pagination.pageIndex * pagination.pageSize);
    } else {
      query = query.take(0).skip(0);
    }

    if (!!props.search?.fields && !!search)
      query.search(search, props.search?.fields);
    if (!!filters) filters.forEach((where) => query.where(where));
    if (!!sorting)
      (Array.isArray(sorting) ? sorting : [sorting]).forEach((sort) => {
        query.sortBy(sort.id as string, sort.desc ? "descending" : "ascending");
      });

    return query;
  }, [
    pagination,
    search,
    props.isPagination,
    props.search?.fields,
    filters,
    sorting,
  ]);

  const result = useQuery<QueryResponse<T>, AxiosError<any>>({
    queryKey: [key, "query", query],
    queryFn: async (): Promise<QueryResponse<T>> => {
      try {
        const data: any = await manager.current?.executeQuery(query);
        return data.actual;
      } catch (error: any) {
        throw error;
      }
    },
    enabled:
      isEnabled &&
      !!manager.current &&
      (!props.isPagination || !!pagination.pageSize),
  });

  return {
    result,
    setPagination,
    setSorting,
    setFilters,
    setSearch,
  };
}

export type { DataManagerProps };
export default useDataManager;
