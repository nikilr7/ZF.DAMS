import { useEntities, useEntity } from "../hooks/serviceUtils";
import { DataManagerProps } from "../hooks/types";
import useDataManager from "../hooks/useDataManager";

export interface IDocumentTemplate {
  id: string;
  name: string;
  documentName: string;
  documentType: string;
  fileBinary: string;
  nextVersion?: IDocumentTemplate | null;
  formatNumber?: string;
  revisionRemarks?: string;
}

const key = "documentTemplate";
const endpoint = "/api/documentTemplate";

export const useDocumentTemplatesQuery = (
  props: DataManagerProps<IDocumentTemplate> = {},
) => useDataManager<IDocumentTemplate>(key, endpoint + "/query", props);
export const useDocumentTemplates = () =>
  useEntities<IDocumentTemplate>(key, endpoint);
export const useDocumentTemplate = (
  id: string | undefined | null,
  toast: boolean = true,
) =>
  useEntity<IDocumentTemplate>(
    key,
    endpoint,
    id,
    toast
      ? {
          add: "Document Template added",
          update: "Document Template updated",
          delete: "Document Template deleted",
        }
      : undefined,
  );

export const useDocumentTemplatesWithRevisions = () =>
  useEntities<IDocumentTemplate>(key, endpoint + "/report");
