import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { IFileAttachment } from "../hooks/defs";

const endpoint = "/api/storage";

export const useStorage = () => {
  const upload = useMutation<IFileAttachment, AxiosError<any>, any, any>({
    mutationFn: async (file: any): Promise<IFileAttachment> => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post<IFileAttachment>(endpoint, formData);
      return data;
    },
  });

  return {
    upload,
  };
};
