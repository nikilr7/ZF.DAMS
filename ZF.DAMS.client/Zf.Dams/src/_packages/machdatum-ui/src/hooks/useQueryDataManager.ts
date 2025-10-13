import { DataManagerProps } from "./types";
import { UseQueryResult } from "@tanstack/react-query";
import useJsonDataManager from "./useJsonDataManager";

function useQueryDataManager<T>(
  source: UseQueryResult<T[]>,
  props: DataManagerProps<T> = {},
) {
  return useJsonDataManager(source.data, props, source);
}

export type { DataManagerProps };
export default useQueryDataManager;
