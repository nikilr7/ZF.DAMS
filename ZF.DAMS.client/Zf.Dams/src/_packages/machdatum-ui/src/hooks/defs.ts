import { IInputField } from "./useDocument";

export interface IDocument extends IPartialDocument {
  status: string;
}

export interface IDocumentDTO extends IPartialDocumentDTO {
  status: string;
}

export interface IPartialDocumentDTO {
  id: string;
  uniqueNumber: string;
  type: string;
  fields: any;
  attachments: IDocumentAttachment[];
  hierarchies: IDocumentHierarchy[];
  masterData: IDocumentMasterData[];
  assignees: IDocumentAssignee[];
}

export interface IPartialDocument {
  id: string;
  uniqueNumber: string;
  type: string;
  fields: any;
  documents: {
    [key: string]: {
      type: string;
      id: string;
    };
  };
  attachments: IDocumentAttachment[];
  hierarchies: IDocumentHierarchy[];
  masterData: IDocumentMasterData[];
  assignees: IDocumentAssignee[];
  documentType: string;
}

export interface IDocumentHierarchy {
  name: string;
  hierarchy: {
    id: string;
  };
}

export interface IDocumentMasterData {
  name: string;
  masterData: {
    id: string;
    label?: string;
  };
}

export interface IDocumentAttachment {
  fileAttachment: IFileAttachment;
  name: string;
}

export interface IDocumentAssignee {
  name: string;
  assignee: IAssignee;
}

export interface IAssignee {
  id: string;
  users: {
    id: string;
    firstName?: string;
    profileUrl?: string;
    email?: string;
    displayName?: string;
  }[];
  groups: {
    members: any;
    id: string;
    label?: string;
  }[];
  userRoles: {
    id: string;
    name?: string;
    label?: string;
  }[];
}

export interface IFileAttachment {
  id: string;
  key: string;
  fileName: string;
  contentType: string;
  createdAt: Date;
  base64?: string;
}

export interface IFieldProps {
  field: IInputField;
  isEditable?: boolean;
  isMulti?: boolean;
  parentField?: IInputField;
  size?: "compact" | "default";
  isRequired?: boolean;
}
