import { useToast } from "@chakra-ui/react";
import {
  useQuery,
  useQueryClient,
  useMutation,
  UseQueryOptions,
  QueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export const prefetchEntities = async <T extends { id: string }>(
  queryClient: QueryClient,
  key: string | string[],
  url: string,
) => {
  await queryClient.prefetchQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async ({ signal }): Promise<T[]> => {
      const { data } = await axios.get<T[]>(url, { signal });
      return data;
    },
    staleTime: Infinity,
  });
  return queryClient.getQueryData<T[]>(Array.isArray(key) ? key : [key]);
};

export const prefetchEntity = async <T extends { id: string }>(
  queryClient: QueryClient,
  key: string,
  url: string,
  id: string | undefined | null,
) => {
  await queryClient.prefetchQuery({
    queryKey: [key, id],
    queryFn: async ({ signal }): Promise<T> => {
      const { data } = await axios.get<T>(url + "/" + id, { signal });
      return data;
    },
    staleTime: Infinity,
  });
  return queryClient.getQueryData<T>([key]);
};

export const useEntities = <T extends { id: string }>(
  key: string | string[],
  url: string,
  options?: Partial<UseQueryOptions<T[], AxiosError<any>>>,
) => {
  const entities = useQuery<T[], AxiosError<any>>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async ({ signal }): Promise<T[]> => {
      const { data } = await axios.get<T[]>(url, { signal });
      return data;
    },
    ...options,
  });

  return {
    entities,
  };
};

interface IToastOptions {
  add?: string;
  update?: string;
  delete?: string;
}

export const useEntity = <T extends { id: string }, DTO = T>(
  key: string,
  url: string,
  id: string | undefined | null,
  toastOptions?: IToastOptions,
  invalidateKeys?: string[][],
  isDisabled?: boolean,
  options?: Partial<UseQueryOptions<T, AxiosError<any>>>,
) => {
  const toast = useToast({
    status: "success",
    duration: 2000,
    isClosable: true,
    position: "top",
  });

  const queryClient = useQueryClient();

  const invalidateActive = () => {
    queryClient.invalidateQueries({
      queryKey: [key],
      type: "active",
    });

    invalidateKeys?.forEach((key) => {
      queryClient.invalidateQueries({
        queryKey: key,
        type: "active",
      });
    });
  };

  const entity = useQuery<T, AxiosError<any>>({
    queryKey: [key, id],
    queryFn: async ({ signal }): Promise<T> => {
      const { data } = await axios.get<T>(url + "/" + id, { signal });
      return data;
    },
    enabled: !!id && !isDisabled,
    ...options,
  });

  const add = useMutation<T, AxiosError<any>, DTO, any>({
    mutationFn: async (entity: DTO): Promise<T> => {
      const { data } = await axios.post<T>(url, entity);
      return data;
    },
    onMutate: () => {
      toast.close(`${key}-add-toast`);
    },
    onSuccess: (addedEntity) => {
      !!toastOptions?.add &&
        !toast.isActive(`${key}-add-toast`) &&
        toast({ title: toastOptions.add, id: `${key}-add-toast` });

      queryClient.setQueryData([key, addedEntity.id], addedEntity);
      queryClient.setQueryData([key], (cachedEntities: T[] | undefined) =>
        cachedEntities ? [...cachedEntities, addedEntity] : undefined,
      );
      invalidateActive();
    },
    onError: (error) => {
      toast({
        title: errorMessage(error),
        status: "error",
        id: `${key}-add-toast`,
      });
    },
  });

  const update = useMutation<T, AxiosError<any>, DTO, any>({
    mutationFn: async (entity: DTO): Promise<T> => {
      const { data } = await axios.put<T>(url + "/" + id, entity);
      return data;
    },
    onMutate: () => {
      toast.close(`update-toast-${id}`);
    },
    onSuccess: (updatedEntity) => {
      !!toastOptions?.update &&
        !toast.isActive(`update-toast-${id}`) &&
        toast({
          title: toastOptions.update.toString(),
          id: `update-toast-${id}`,
        });

      queryClient.setQueryData([key, id], updatedEntity);
      queryClient.setQueryData(
        [key],
        (cachedEntities: T[] | undefined) =>
          cachedEntities?.map((cachedEntity) =>
            cachedEntity.id === updatedEntity.id ? updatedEntity : cachedEntity,
          ),
      );
      invalidateActive();
    },
    onError: (error) => {
      toast({
        title: errorMessage(error),
        status: "error",
        id: `update-toast-${id}`,
      });
    },
  });

  const remove = useMutation<string, AxiosError<any>, string, any>({
    mutationFn: async (id: string): Promise<string> => {
      const { data } = await axios.delete(url + "/" + id);
      return data;
    },
    onMutate: () => {
      toast.close(`delete-toast-${id}`);
    },
    onSuccess: (deletedId) => {
      !!toastOptions?.delete &&
        !toast.isActive(`delete-toast-${id}`) &&
        toast({ title: toastOptions.delete, id: `delete-toast-${id}` });

      queryClient.setQueryData([key, id], null);
      queryClient.setQueryData(
        [key],
        (cachedEntities: T[] | undefined) =>
          cachedEntities?.filter(
            (cachedEntity) => cachedEntity.id !== deletedId,
          ),
      );
      invalidateActive();
    },
    onError: (error) => {
      toast({
        title: errorMessage(error),
        status: "error",
        id: `delete-toast-${id}`,
      });
    },
  });

  return {
    entity,
    add,
    update,
    remove,
    toast,
  };
};

const errorMessage = (error: AxiosError<any, any>) => {
  if (error?.response?.data?.status === 400 && error?.response?.data?.errors)
    return Object.values(error.response.data.errors).flat().join("\n");

  if (error?.response?.data?.code === 409)
    return error?.response?.data?.message.toString();

  if (typeof error?.response?.data === "string") {
    return error.response.data;
  }

  if (typeof error?.response?.data === "object") {
    const { message, detail } = error.response.data;
    console.log(message, detail, error);

    if (message && detail) {
      return `${message} - Contact Administrator`;
    }
    if (message) {
      return message;
    }
    if (detail) {
      return detail;
    }
  }

  return error?.response?.data?.toString() ?? "Error";
};
