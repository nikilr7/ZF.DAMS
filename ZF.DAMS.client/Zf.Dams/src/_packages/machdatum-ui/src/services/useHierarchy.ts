import { QueryClient } from "@tanstack/react-query";
import {
  prefetchEntities,
  useEntities,
  useEntity,
} from "../hooks/serviceUtils";
import { IHierarchyScheme } from "./useHierarchyScheme";
import { IMaster } from "./useMaster";
import { IUserRoleGroup } from "./useMasterData";

export interface IHierarchy {
  scheme: IHierarchyScheme;
  masterData?: {
    id: string;
    label: string;
    master?: IMaster;
    data: {
      [key: string]: any;
    };
    userRoleGroups?: IUserRoleGroup[];
  };
  asset?: {
    id: string;
    name: string;
  };
  parent?: IHierarchy | null;
  userRoleGroups?: IUserRoleGroup[];
  label?: string;
  id: string;
}

interface IHierarchyDTO {
  asset?: string;
  masterData?: string;
  parent?: string;
}

const key = "hierarchy";
const endpoint = (scheme: string | undefined) => `/api/hierarchy/${scheme}`;
const directoryEndpoint = (scheme: string | undefined) =>
  `/api/hierarchy/${scheme}/directory`;

export const prefetchHierarchies = async (
  queryClient: QueryClient,
  scheme: { id: string },
) => {
  await prefetchEntities(
    queryClient,
    [key, scheme?.id ?? ""],
    endpoint(scheme.id),
  );
};

export const useHierarchiesForDirectory = (scheme: string | undefined) => {
  return useEntities<IHierarchy>(
    [key, scheme ?? ""],
    directoryEndpoint(scheme),
    {
      enabled: scheme !== undefined,
    },
  );
};

export const useHierarchies = (scheme: string | undefined) => {
  return useEntities<IHierarchy>([key, scheme ?? ""], endpoint(scheme), {
    enabled: scheme !== undefined,
    staleTime: Infinity,
  });
};
export const useHierarchy = (
  id: string | undefined | null,
  scheme: string,
  toast: boolean = true,
) =>
  useEntity<IHierarchy, IHierarchyDTO | { userRoleGroups: IUserRoleGroup[] }>(
    key,
    endpoint(scheme),
    id,
    toast
      ? {
          add: "Hierarchy added",
          update: "Hierarchy updated",
          delete: "Hierarchy deleted",
        }
      : undefined,
    undefined,
  );
