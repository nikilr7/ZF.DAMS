import { QueryClient } from "@tanstack/react-query";
import {
  prefetchEntities,
  useEntities,
  useEntity,
} from "../hooks/serviceUtils";
import { DataManagerProps } from "../hooks/types";
import useDataManager from "../hooks/useDataManager";

export interface IUserRole {
  id: string;
  name: string;
  label: string;
  description?: string | null;
}
const key = "user_role";
const endpoint = "/api/userrole";

export const useUserRolesQuery = (props: DataManagerProps<IUserRole> = {}) =>
  useDataManager<IUserRole>(key, endpoint + "/query", props);
export const useUserRoles = () =>
  useEntities<IUserRole>(key, endpoint, {
    staleTime: Infinity,
  });
export const prefetchUserRoles = async (queryClient: QueryClient) =>
  await prefetchEntities(queryClient, key, endpoint);
export const useUserRole = (
  id: string | undefined | null,
  toast: boolean = true,
) =>
  useEntity<IUserRole>(
    key,
    endpoint,
    id,
    toast
      ? {
          add: "User Role added",
          update: "User Role updated",
          delete: "User Role deleted",
        }
      : undefined,
  );
