import { useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export interface ISMTPConfiguration {
  server: string;
  port: number;
  username?: string;
  password?: string;
  useSSL: boolean;
}

export interface IShift {
  name: string;
  startTime: string;
  endTime: string;
}

export interface ITimeConfiguration {
  timezone: string;
  dayStartOffset: number;
  dateTimeFormat: string;
  shifts: IShift[];
}

const endpoint = "/api/configuration";

export default function useConfiguration<T>(key: string) {
  const toast = useToast({
    status: "success",
    duration: 2000,
    isClosable: true,
    position: "top",
  });

  const queryClient = useQueryClient();

  const configuration = useQuery<T, Error>({
    queryKey: ["configuration", key],
    queryFn: async () => {
      const { data } = await axios.get<T>(`${endpoint}/${key}`);
      return data;
    },
  });

  const update = useMutation<T, Error, T, any>({
    mutationFn: async (config: T) => {
      const { data } = await axios.put(`${endpoint}/${key}`, config);
      return data;
    },
    onMutate: () => {
      toast.close(`update-toast-configuration-${key}`);
    },
    onSuccess: (updatedEntity) => {
      !toast.isActive(`update-toast-configuration-${key}`) &&
        toast({
          title: "Configuration updated",
          id: `update-toast-configuration-${key}`,
        });

      queryClient.setQueryData([key], updatedEntity);
    },
    onError: (error) => {
      toast({
        title: error?.message ?? "Error",
        status: "error",
        id: `update-toast-configuration-${key}`,
      });
    },
  });

  return {
    configuration,
    update,
  };
}

export const useTimezones = () =>
  useQuery<string[], Error>({
    queryKey: ["timezones"],
    queryFn: async () => {
      const { data } = await axios.get<string[]>(
        "/api/configuration/time/timezones",
      );
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

export interface IEmailTest {
  to: string;
  subject: string;
  body?: string;
}

export const useEmailTest = () => {
  const toast = useToast({
    status: "success",
    duration: 2000,
    isClosable: true,
    position: "top",
  });

  return useMutation<unknown, AxiosError<string>, IEmailTest, any>({
    mutationFn: async (emailTest: IEmailTest) => {
      const { data } = await axios.put(`${endpoint}/smtp/test`, emailTest);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Email sent",
        status: "success",
      });
    },
  });
};
