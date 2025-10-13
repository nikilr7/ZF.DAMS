import {
  QueryClient,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  prefetchEntities,
  useEntities,
  useEntity,
} from "../hooks/serviceUtils";
import { IGroup } from "./useGroup";
import { IUserRole } from "./useUserRole";
import { useToast } from "@chakra-ui/react";

export interface IMasterData {
  id: string;
  [key: string]: any;
  userRoleGroups?: IUserRoleGroup[];
}

export interface IUserRoleGroup {
  userRole: IUserRole;
  group: IGroup;
}

const key = "master_data";
const endpoint = "/api/master/data";

export const prefetchMastersData = async (
  queryClient: QueryClient,
  id: string,
) => {
  await prefetchEntities(queryClient, [key, id], endpoint + "/" + id);
};

export const useMastersData = (id: string) =>
  useEntities<IMasterData>([key, id], endpoint + "/" + id, {
    staleTime: Infinity,
  });

export const useMasterData = (
  master: string,
  id: string | undefined | null,
  label: string,
  toast: boolean = true,
) =>
  useEntity<IMasterData>(
    key,
    endpoint + "/" + master,
    id,
    toast
      ? {
          add: `${label} added`,
          update: `${label} updated`,
          delete: `${label} deleted`,
        }
      : undefined,
  );

export const useMultipleMastersData = (ids: string[]) =>
  useQueries({
    queries: ids.map((id) => ({
      queryKey: [key, id],
      queryFn: async () => {
        const { data } = await axios.get(endpoint + "/" + id);
        return data as IMasterData;
      },
    })),
  });

export const useBulkMastersData = (ids: string[] | undefined) =>
  useQuery({
    queryKey: [key, ids],
    queryFn: async () => {
      const { data } = await axios.post(endpoint + "/bulk", { ids });
      return data as { [key: string]: IMasterData[] };
    },
    enabled: !!ids && ids.length > 0,
    staleTime: Infinity,
  });

export const useBulkUploadMastersData = (master: string, label: string) => {
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

  const add = useMutation<any, AxiosError<any>, IMasterData[], any>({
    mutationFn: async (masterData) => {
      if (!Array.isArray(masterData)) {
        throw new Error("Bulk upload expects an array of MasterData");
      }

      return await axios.post(`${endpoint}/${master}/upload`, masterData);
    },
    onMutate: () => {
      toast.close(`bulk-add-toast-${key}`);
    },
    onSuccess: (entity) => {
      !toast.isActive(`bulk-update-toast-${key}`) &&
        toast({
          title: `${label} added in Bulk successfully`,
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

  const update = useMutation<any, AxiosError<any>, IMasterData | IMasterData[]>(
    {
      mutationFn: async (data) => {
        if (Array.isArray(data)) {
          const requests = data.map((data: IMasterData) =>
            axios.put<IMasterData>(`${endpoint}/${master}/${data.id}`, data),
          );

          const responses = await Promise.all(requests);
          return responses.map((response) => response.data);
        } else {
          return await axios.put<IMasterData>(
            `${endpoint}/${master}/${data.id}`,
            data,
          );
        }
      },
      onMutate: () => {
        toast.close(`bulk-update-toast-${key}`);
      },
      onSuccess: (entity) => {
        !toast.isActive(`bulk-update-toast-${key}`) &&
          toast({
            title: `${label} updated successfully`,
            id: `bulk-update-toast-${key}`,
            status: "success",
          });

        queryClient.setQueryData([key], entity);
        invalidateActive();
      },
      onError: (error) => {
        toast({
          title: error?.response?.data ?? "Error",
          status: "error",
          id: `bulk-update-toast-${key}`,
        });
      },
    },
  );

  const remove = useMutation<any, AxiosError<any>, string>({
    mutationFn: async (id: string) => {
      return await axios.delete(`${endpoint}/${master}/${id}`);
    },
    onMutate: () => {
      toast.close(`bulk-update-toast-${key}`);
    },
    onSuccess: (id) => {
      !toast.isActive(`bulk-update-toast-${key}`) &&
        toast({
          title: `${label} deleted successfully`,
          id: `bulk-update-toast-${key}`,
          status: "success",
        });

      queryClient.removeQueries({
        queryKey: [key, id],
      });
      invalidateActive();
    },
    onError: (error) => {
      toast({
        title: error?.response?.data ?? "Error",
        status: "error",
        id: `bulk-update-toast-${key}`,
      });
    },
  });

  return {
    add,
    update,
    remove,
  };
};
