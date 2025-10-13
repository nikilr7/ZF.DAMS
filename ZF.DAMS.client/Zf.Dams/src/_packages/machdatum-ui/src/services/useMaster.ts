import { QueryClient } from "@tanstack/react-query";
import {
  prefetchEntities,
  prefetchEntity,
  useEntities,
  useEntity,
} from "../hooks/serviceUtils";
import { DataManagerProps } from "../hooks/types";
import useQueryDataManager from "../hooks/useQueryDataManager";
import { prefetchMastersData } from "./useMasterData";

export interface IMaster {
  id: string;
  name: string;
  label: string;
  displayField: string;
  description?: string | null;
  yamlConfiguration: string;
  groups?: { id: string; name?: string | null }[] | null;
  userRoles?:
    | {
        id: string;
        label?: string | null;
      }[]
    | null;
}

const key = "master";
const endpoint = "/api/master";

export const prefetchMasters = async (queryClient: QueryClient) => {
  const result = await prefetchEntities(queryClient, key, endpoint);
  result?.forEach((item) => {
    prefetchEntity(queryClient, key, endpoint, item.id);
    prefetchMastersData(queryClient, item.id);
  });
};

export const useMasters = () =>
  useEntities<IMaster>(key, endpoint, {
    staleTime: Infinity,
  });
export const useMastersQuery = (props: DataManagerProps<IMaster> = {}) => {
  const { entities } = useMasters();
  return useQueryDataManager<IMaster>(entities, props);
};
export const useMaster = (
  id: string | undefined | null,
  toast: boolean = true,
) =>
  useEntity<IMaster>(
    key,
    endpoint,
    id,
    toast
      ? {
          add: "Master added",
          update: "Master updated",
          delete: "Master deleted",
        }
      : undefined,
    undefined,
    undefined,
    {
      staleTime: Infinity,
    },
  );
