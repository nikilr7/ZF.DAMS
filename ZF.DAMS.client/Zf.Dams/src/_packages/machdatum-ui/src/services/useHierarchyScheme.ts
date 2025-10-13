import { QueryClient } from "@tanstack/react-query";
import {
  prefetchEntities,
  useEntities,
  useEntity,
  prefetchEntity,
} from "../hooks/serviceUtils";
import { prefetchHierarchies } from "./useHierarchy";

export interface IHierarchySchemeLevel {
  order: number;
  master: {
    id: string;
    name?: string | null;
    label?: string | null;
  };
}

export interface IHierarchyScheme {
  name: string;
  levels: IHierarchySchemeLevel[];
  id: string;
}

const key = "hierarchyscheme";
const endpoint = "/api/hierarchyscheme";

export const prefetchHierarchySchemes = async (queryClient: QueryClient) => {
  const result = await prefetchEntities(queryClient, key, endpoint);
  result?.forEach((item) => {
    prefetchEntity(queryClient, key, endpoint, item.id);
    prefetchHierarchies(queryClient, item);
  });
};

export const useHierarchySchemes = () =>
  useEntities<IHierarchyScheme>(key, endpoint, {
    staleTime: Infinity,
  });
export const useHierarchyScheme = (
  id: string | undefined | null,
  toast: boolean = true,
) =>
  useEntity<IHierarchyScheme>(
    key,
    endpoint,
    id,
    toast
      ? {
          add: "Hierarchy Scheme added",
          update: "Hierarchy Scheme updated",
          delete: "Hierarchy Scheme deleted",
        }
      : undefined,
    undefined,
    undefined,
    {
      staleTime: Infinity,
    },
  );
