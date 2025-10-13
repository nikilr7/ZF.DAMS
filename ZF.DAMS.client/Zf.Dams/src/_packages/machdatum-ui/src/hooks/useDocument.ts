import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { DateTime } from "luxon";
import { useToast } from "@chakra-ui/react";
import { IDocument } from "./defs";
import { Predicate } from "@syncfusion/ej2-data";

export interface IDocumentConfiguration {
  name: string;
  label: string;
  color?: string;
  hierarchyScheme: string;
  description?: string;
  statuses?: IStatus[];
  fields?: IInputField[];
  screens?: IScreen[];
  transitions?: ITransition[];
  tableViews?: ITableView[];
  calendarView?: ICalendarView;
  checklists?: IChecklist[];
  properties?: { [key: string]: string };
  uniqueNumber?: IUniqueNumber;
  mandatoryFields?: IMandatoryField[];
  scheduledEmails?: IScheduledEmail[];
}

export interface IMandatoryField {
  name: string;
}

export interface IScheduledEmail {
  name: string;
  label: string;
  rRule: string;
  whereFilter: Predicate[];
}

interface IUniqueNumber {
  pattern: string;
  parts: number;
}

interface IChecklist {
  name: string;
  label: string;
  columns: IInputField[];
}

export interface ITableView {
  name: string;
  label: string;
  columns: {
    field: string;
  }[];
  filters?: IFilter[];
  sorts?: ISort[];
}

export interface ICalendarView {
  start: string;
  end: string;
  label: string;
}

interface IFilter {
  field: string;
  values: {
    value: string;
  }[];
}

export interface ISort {
  field: string;
  direction: string;
}

export interface IStatus {
  name: string;
  label: string;
  description?: string;
  color?: string;
  category: string;
  fieldPermissions: IFieldPermission[];
  hiddenFields?: string[];
}

export interface IInputField {
  name: string;
  label?: string | undefined;
  description?: string;
  type: string;
  view?: "display" | "display-input" | "input";
  options?: IOption[];
  source?: string;
  properties?: {
    [key: string]: string;
  };
  required?: boolean;
}

export interface IOption {
  name: string;
  label: string;
  value: number;
}

export interface IScreen {
  name: string;
  fields: {
    [key: string]: IFieldProperty;
  };
}

export interface IFieldProperty {
  size: number | undefined;
  section: string | undefined;
  required?: boolean;
  acl: string[];
}

export interface ITransition {
  name: string;
  label: string;
  description?: string;
  from: string;
  to: string;
  screen?: string;
  icon?: string;
  color?: string;
  remarks: "required" | "optional" | "none";
  acl: string[];
  bulk?: boolean;
}

export interface ITransitionLog {
  id: string;
  timestamp: DateTime;
  user: string;
  from: string;
  to: string;
  remarks?: string;
}

export interface IFieldPermission {
  field: string;
  acl: string[];
}

export interface IFeatureFlag {
  [key: string]: string;
}

export function useDocumentTypes(document: string | undefined) {
  const types = useQuery<
    { name: string; label: string; color: string }[],
    AxiosError<any>
  >({
    queryKey: ["document", document, "types"],
    queryFn: async ({ signal }) => {
      const { data } = await axios.get<any>(`/api/document/types/${document}`, {
        signal,
      });
      return data;
    },
    enabled: !!document,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return types;
}

export function useDocumentConfiguration<T extends IDocumentConfiguration>(
  document?: string,
  refetchInterval?: number,
) {
  const queryClient = useQueryClient();
  const toast = useToast({
    status: "success",
    duration: 2000,
    isClosable: true,
    position: "top",
  });

  const response = useQuery<T, AxiosError<any>>({
    queryKey: ["document", document, "configuration"],
    queryFn: async ({ signal }) => {
      const { data } = await axios.get<T>(`/api/document/${document}`, {
        signal,
      });
      return data;
    },
    refetchInterval: refetchInterval,
    enabled: !!document,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const update = useMutation<T, AxiosError<any>, T, any>({
    mutationFn: async (config: T) => {
      const { data } = await axios.put(`/api/document/${document}`, config);
      return data;
    },
    onMutate: () => {
      toast.close(`update-toast-${document}`);
    },
    onSuccess: (data) => {
      toast({
        title: "Document updated successfully",
        id: `update-toast-${document}`,
      });
      queryClient.setQueryData(["document", document], data);
    },
    onError: (error) => {
      toast({
        title: error?.response?.data ?? "Error updating document",
        status: "error",
        id: `update-toast-${document}`,
      });
    },
  });

  return {
    response,
    update,
  };
}

export function useDocument(key: string, id: string | null | undefined) {
  return useQuery<IDocument, AxiosError<any>>({
    queryKey: [key, id],
    queryFn: async ({ signal }): Promise<IDocument> => {
      const { data } = await axios.get<IDocument>("/api/" + key + "/" + id, {
        signal,
      });
      return data;
    },
    enabled: !!id && id !== "new",
  });
}

export function useDocumentConfigurations() {
  return useQuery({
    queryKey: ["document_configurations"],
    queryFn: async ({ signal }) => {
      const { data } = await axios.get("/api/document", {
        signal,
      });
      return data;
    },
  });
}

export function useFeatureFlags() {
  return useQuery<IFeatureFlag, AxiosError<any>>({
    queryKey: ["feature_flag"],
    queryFn: async ({ signal }): Promise<IFeatureFlag> => {
      const { data } = await axios.get<IFeatureFlag>("/api/document/flags", {
        signal,
      });
      return data;
    },
  });
}
