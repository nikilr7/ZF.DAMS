import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  prefetchEntities,
  useEntities,
  useEntity,
} from "../hooks/serviceUtils";
import useDataManager, { DataManagerProps } from "../hooks/useDataManager";
import { useToast } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";

interface IGroupEntityDTO {
  id: string;
  name: string;
  label: string;
}

interface IGroupDTO extends IGroupEntityDTO {
  description?: string | null;
  members: {
    id: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
    profileUrl?: string;
  }[];
}

export interface IGroup {
  id: string;
  name: string;
  label: string;
  description?: string | null;
  members: { id: string }[];
  roles?: { id: string; name?: string | null }[];
}

const key = "groups";
const endpoint = "/api/groups";

export const useGroupsQuery = (props: DataManagerProps<IGroup> = {}) =>
  useDataManager<IGroupDTO>(key, endpoint + "/query", props);
export const useGroups = () =>
  useEntities<IGroupEntityDTO>(key, endpoint, {
    staleTime: Infinity,
  });
export const prefetchGroups = async (queryClient: QueryClient) =>
  await prefetchEntities(queryClient, key, endpoint);
export const useGroup = (id: string | undefined, toast: boolean = true) =>
  useEntity<IGroup>(
    key,
    endpoint,
    id,
    toast
      ? {
          add: "Group added",
          update: "Group updated",
          delete: "Group deleted",
        }
      : undefined,
  );

export const useBulkGroups = () => {
  const queryClient = useQueryClient();

  const invalidateActive = () => {
    queryClient.invalidateQueries({
      queryKey: [key],
      type: "active",
    });
  };

  const toast = useToast({
    duration: 2000,
    isClosable: true,
    position: "top",
  });

  const add = useMutation<any, AxiosError<any>, IGroup | IGroup[], any>({
    mutationFn: async (groups) => {
      if (Array.isArray(groups)) {
        const requests = groups.map((group: IGroup) =>
          axios.post<IGroup>(`${endpoint}`, group),
        );

        const responses = await Promise.all(requests);
        return responses.map((response) => response.data);
      } else {
        return await axios.post<IGroup>(`${endpoint}`, groups);
      }
    },
    onMutate: () => {
      toast.close(`${key}-bulk-add-toast`);
    },
    onSuccess: (entity) => {
      !toast.isActive(`bulk-add-toast-${key}`) &&
        toast({
          title: "Groups added in Bulk successfully",
          id: `bulk-add-toast-${key}`,
          status: "success",
        });

      queryClient.setQueryData([key], entity);
      invalidateActive();
    },
    onError: (error) => {
      if (!toast.isActive(`bulk-add-error-toast-${key}`)) {
        toast({
          title: error?.response?.data ?? "Error",
          status: "error",
          id: `bulk-add-error-toast-${key}`,
        });
      }
    },
  });

  const upload = useMutation<any, AxiosError<any>, IGroup[], any>({
    mutationFn: async (groups) => {
      return await axios.post(`${endpoint}/upload`, groups);
    },
    onMutate: () => {
      toast.close(`${key}-bulk-upload-toast`);
    },
    onSuccess: () => {
      !toast.isActive(`bulk-upload-toast-${key}`) &&
        toast({
          title: "Groups updated in Bulk successfully",
          id: `bulk-upload-toast-${key}`,
          status: "success",
        });

      queryClient.invalidateQueries({ queryKey: [key] });
      invalidateActive();
    },
    onError: (error) => {
      if (!toast.isActive(`bulk-upload-error-toast-${key}`)) {
        toast({
          title: error?.response?.data ?? "Error",
          status: "error",
          id: `bulk-upload-error-toast-${key}`,
        });
      }
    },
  });

  return {
    add,
    upload,
  };
};
