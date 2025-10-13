import { useMemo, useState } from "react";
import { DataManager, Predicate, Query } from "@syncfusion/ej2-data";
import { DataManagerProps, DataManagerResponse } from "./types";
import { UseQueryResult } from "@tanstack/react-query";

function useJsonDataManager<T>(
  raw: T[] | undefined,
  props: DataManagerProps<T> = {},
  queryResult: UseQueryResult<T[]> | undefined = undefined,
  isOfflineMode: boolean = false,
) {
  const [search, setSearch] = useState<{
    input?: string;
    fields: string[];
  }>({
    input: props.search?.input ?? "",
    fields: props.search?.fields?.length ? props.search.fields : [], // default searchable fields
  });

  const [filters, setFilters] = useState<Predicate[] | undefined>(
    props.filters,
  );

  const [pagination, setPagination] = useState(
    props.pagination || {
      pageIndex: 0,
      pageSize: 0,
    },
  );

  const [sorting, setSorting] = useState<
    { id: keyof T; desc: boolean }[] | undefined
  >(props.sorting);

  const query = useMemo<Query>(() => {
    const query = new Query();

    if (isOfflineMode) return query;

    const safeSearch = search ?? { input: "", fields: ["no", "status"] };
    const input = safeSearch.input ?? "";
    if (input.trim()) {
      query.search(input, safeSearch.fields, undefined, true);
    }

    if (!!search && !!search.input)
      query.search(search.input, search.fields, undefined, true);
    if (!!filters) filters.forEach((where) => query.where(where));
    if (!!sorting)
      sorting.forEach((sort) => {
        query.sortBy(sort.id as string, sort.desc ? "descending" : "ascending");
      });

    if (props.isPagination) {
      query
        .skip(pagination.pageIndex * pagination.pageSize)
        .take(pagination.pageSize);
    }

    return query;
  }, [pagination, search, filters, sorting]);

  const data: T[] = useMemo(() => {
    const manager = new DataManager(raw as any);
    const data = manager.executeLocal(query) as T[];
    return data;
  }, [query, raw]);

  return {
    result: {
      isLoading: raw === undefined,
      isFetching: raw === undefined,
      ...queryResult,
      data: {
        result: data,
        count: raw?.length ?? 0,
      },
    },
    setPagination,
    setSorting,
    setFilters,
    setSearch: (input: string | undefined) => {
      setSearch((prev) => ({
        fields: prev?.fields?.length ? prev.fields : ["no", "status"],
        input: input ?? "",
      }));
    },
  } as DataManagerResponse<T>;
}

export type { DataManagerProps };
export default useJsonDataManager;
