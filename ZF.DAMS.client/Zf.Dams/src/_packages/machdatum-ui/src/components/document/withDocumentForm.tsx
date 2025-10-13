import { forwardRef, useEffect, useMemo } from "react";
import _ from "lodash";
import { ZodType } from "zod";
import { Box, Heading } from "@chakra-ui/react";
import DocumentTypeSelector from "./DocumentTypeSelector";
import { DocumentField } from "./DocumentField";
import { StringParam, useQueryParam } from "use-query-params";
import { useNavigate } from "react-router-dom";
import { useDocumentContext } from "../../context/DocumentConfigurationContext";
import {
  IDocumentConfiguration,
  IInputField,
  useDocument,
  IScreen,
} from "../../hooks/useDocument";
import { withModalForm, IFormProps, withForm } from "../forms";
import { getDocumentSchema } from "./utils/schema";

const DocumentTypeSelectorForm = withModalForm(DocumentTypeSelector);

interface IProps {
  id?: string | undefined | null;
}

export interface IDocumentFormProps extends IProps {
  configuration?: IDocumentConfiguration;
  fieldsRenderer: (
    isEditable: (name: string) => boolean,
    isRequired: (name: string) => boolean,
    parentField?: IInputField | undefined,
    status?: string,
  ) => JSX.Element;
  fields: IInputField[];
  type: string;
  isEnableUpdate?: boolean;
}

export function withDocumentForm<T>(
  Component: React.ComponentType<IFormProps & IDocumentFormProps & T>,
  parentType: string,
  schema: { [key: string]: ZodType<any> },
  isSingleType: boolean = false,
  getType?: (entity: any) => string,
  parentDocumentType?: string,
  view?: string,
) {
  return forwardRef<any, IProps & T>((props, ref) => {
    const { id } = props;
    const { data: entity } = useDocument(parentDocumentType ?? parentType, id);
    const navigate = useNavigate();
    const [documentType, setDocumentType] = useQueryParam(
      "documentType",
      StringParam,
    );
    const types = useDocumentContext().types(parentType);

    const type =
      parentType +
      (getType
        ? `/${getType(entity)}`
        : isSingleType
        ? ""
        : entity?.type
        ? `/${entity.type}`
        : documentType
        ? `/${documentType}`
        : "");

    const configuration = useDocumentContext().get(type);

    useEffect(() => {
      if (entity) {
        getType
          ? setDocumentType(getType(entity), "replaceIn")
          : setDocumentType(entity.type, "replaceIn");
      }
    }, [entity?.type]);

    const screen = useMemo(
      () =>
        !id
          ? configuration?.screens?.find((s) => s.name === "create")
          : configuration?.screens?.find((s) => s.name === "edit"),
      [id, configuration?.screens],
    );

    const enableUpdateButton = useMemo(() => {
      if (screen?.name !== "edit") return true;
      return screen?.fields
        ? !Object.values(screen.fields).some(
            (field) => field && field.acl?.includes("none"),
          )
        : false;
    }, [screen]);

    const screenFields: (IInputField & { isEditable?: boolean })[] =
      useMemo(() => {
        return screen
          ? (Object.entries(screen.fields ?? {})
              .map(
                ([name]) =>
                  configuration?.fields?.find((ff) => ff.name === name),
              )
              .filter((f) => f !== undefined) as IInputField[])
          : [];
      }, [configuration?.fields, screen]);

    const fields: (IInputField & { isEditable?: boolean })[] = useMemo(() => {
      return screenFields.filter((f) =>
        view ? (f?.view ?? "input") === view : true,
      );
    }, [screenFields]);

    const Form = useMemo(() => {
      return withForm(Component, getDocumentSchema(schema, fields, screen));
    }, [Component, schema, fields, screen]);

    const sections = useMemo(() => {
      const result: { [key: string]: IInputField[] } = {};
      fields?.forEach((field) => {
        const section = screen?.fields?.[field.name]?.section ?? "_";
        if (!result[section]) result[section] = [];
        result[section].push(field);
      });
      return result;
    }, [fields, screen?.fields]);

    if ((!id || id === "new") && !documentType && !isSingleType) {
      return (
        <DocumentTypeSelectorForm
          types={types ?? []}
          label={configuration?.label}
          onSubmit={setDocumentType}
          isOpen={true}
          onClose={() => navigate(-1)}
        />
      );
    }

    return (
      <Form
        ref={ref}
        {...(props as any)}
        configuration={configuration}
        fieldsRenderer={(isEditable, isRequired, parentField?, status?) =>
          fieldsRenderer(
            sections,
            screen,
            configuration,
            isEditable,
            isRequired,
            parentField,
            status,
          )
        }
        fields={screenFields}
        type={entity?.type ?? documentType ?? ""}
        isEnableUpdate={enableUpdateButton}
      />
    );
  });
}

export const fieldsRenderer = (
  sections: { [key: string]: IInputField[] },
  screen: IScreen | undefined,
  configuration: IDocumentConfiguration | undefined,
  isEditable: (name: string) => boolean,
  isRequired: (name: string) => boolean,
  parentField?: IInputField | undefined,
  status?: string | undefined,
) => {
  const hiddenFields =
    configuration?.statuses?.find((x) => x.name === status)?.hiddenFields ?? [];

  return (
    <>
      {sections["_"]?.map((field, index) => {
        if (hiddenFields.includes(field.name)) return null;
        return (
          <Box
            overflow="hidden"
            flex={getFlex(screen?.fields?.[field.name]?.size)}
            order={(index + 1) * 10}
          >
            <DocumentField
              prefix="fields"
              isEditable={isEditable(field.name)}
              key={field.name}
              field={field}
              property={screen?.fields?.[field.name]}
              isRequired={isRequired?.(field?.name)}
            />
          </Box>
        );
      })}
      {Object.entries(sections).map(([section, fields]) => {
        if (section === "_") return null;

        return (
          <>
            {_.isNaN(parseInt(section)) && section !== "_" ? (
              <Heading variant={"H300"}>{section}</Heading>
            ) : null}
            <Box display={"flex"} flexWrap={"wrap"} gap={1}>
              {fields.map((field) => {
                if (hiddenFields.includes(field.name)) return null;
                return (
                  <Box flex={getFlex(screen?.fields?.[field.name]?.size)}>
                    <DocumentField
                      prefix="fields"
                      isEditable={isEditable(field.name)}
                      key={field.name}
                      field={field}
                      property={screen?.fields?.[field.name]}
                      scheme={configuration?.hierarchyScheme ?? ""}
                      parentField={parentField}
                      isRequired={isRequired(field.name)}
                    />
                  </Box>
                );
              })}
            </Box>
          </>
        );
      })}
    </>
  );
};

const getFlex = (size: number | undefined) => {
  const basis = size ? `${(size / 4) * 100 - 0.675}%` : "100%";
  return `0 0 ${basis}`;
};
