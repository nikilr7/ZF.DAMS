import { QueryClient, useQuery } from "@tanstack/react-query";
import { prefetchEntities, useEntities } from "../hooks/serviceUtils";
import useDataManager, { DataManagerProps } from "../hooks/useDataManager";
import axios from "axios";

const key = "users";
const endpoint = "/api/users";

export const useUsersQuery = <T extends { id: string }>(
  props: DataManagerProps<T> = {},
) => useDataManager<T>(key, endpoint + "/query", props);
export const prefetchUsers = async (queryClient: QueryClient) =>
  await prefetchEntities(queryClient, key, endpoint);
export const useUsers = <T extends { id: string }>() =>
  useEntities<T>(key, endpoint, {
    staleTime: Infinity,
  });
export const useSelf = <T extends { id: string }>() =>
  useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<T> => {
      const { data } = await axios.get("/api/whoami");
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: axios.defaults.headers.common["Authorization"] !== undefined,
  });
