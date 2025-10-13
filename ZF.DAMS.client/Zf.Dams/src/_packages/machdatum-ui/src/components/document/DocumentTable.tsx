import { StringParam, useQueryParam } from "use-query-params";
import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Tooltip,
} from "@chakra-ui/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import TransitionScreen from "./TransitionScreen";
import DocumentStatusTag from "./DocumentStatusTag";
import { saveAs } from "file-saver";
import { FileDown } from "lucide-react";
import _ from "lodash";
import DocumentTypeTag from "./DocumentTypeTag";
import { useDocumentContext } from "../../context/DocumentConfigurationContext";
import { IDocument, IPartialDocument } from "../../hooks/defs";
import { DataManagerProps, DataManagerResponse } from "../../hooks/types";
import { ITransition, IDocumentConfiguration } from "../../hooks/useDocument";
import { IHierarchy } from "../../services/useHierarchy";
import DataTable, { DataTableToolbar, DataTableFilter } from "../datatable";
import DataTableDateTimeFilter from "../datatable/DataTableDateTimeFilter";
import { getSelectColumn } from "../datatable/helper";
import { DocumentFieldView } from "./DocumentFieldView";
import TransitionButton from "./TransitionButton";
import { useDocumentTemplates } from "../../services/useDocumentTemplate";
import { getRelative, timeOptions } from "../datetime/utils";
import { useACL } from "./DocumentACL";
import { getColumnSize } from "./utils/table";
import { AxiosError } from "axios";

export interface IDocumentTableProps<T> {
  type: string;
  paginationText: string;
  query: (props: DataManagerProps<T>) => DataManagerResponse<T>;
  summaryQuery?: (
    props: DataManagerProps<T>,
  ) => DataManagerResponse<T | undefined>;
  columns?: ColumnDef<any, any>[];
  transitionMutation?: UseMutationResult<any, AxiosError<any>, any, unknown>;
  download?: UseMutationResult<any, AxiosError<any>, any, unknown>;
  isSerialNumber?: boolean;
  isPointer?: boolean;
  isPaginated?: boolean;
  isStatusHidden?: boolean;
  isTransitionsHidden?: boolean;
  isSingleType?: boolean;
  searchFields?: string[];
  onInvoked?: (document: IPartialDocument | IDocument) => void;
  search?: string | undefined;
  isPartialDocument?: boolean;
  isFiltersHidden?: boolean;
  isStatusFilterHidden?: boolean;
  parentDocumentType?: string;
  stickyColumns?: number;
  stickyColumnsDirection?: "right" | "left";
  hierarchy?:
    | IHierarchy
    | { [key: string]: IHierarchy | undefined }
    | undefined;
  onGetHierarchy?: (
    data: T,
  ) => IHierarchy | { [key: string]: IHierarchy | undefined } | undefined;
  isSelectHidden?: boolean;
  sortByField?: string;
  filteredData?: T[] | undefined;
  onGetType?: (document: IDocument) => string;
  renderField?: (name: string, isEnabled: boolean) => React.ReactNode;
  onRenderTransition?: (
    document: IDocument,
    transitions: ITransition[],
  ) => React.ReactNode | undefined;
  onRenderStatus?: (document: IDocument) => React.ReactNode | undefined;
  onRenderType?: (document: IDocument) => React.ReactNode | undefined;
  onRenderFilter?: () => React.ReactNode | React.ReactNode[] | undefined;
  onFilterData?: (data: T[] | undefined) => void;
  onRenderCustomFilter?: () => React.ReactNode | undefined;
  onRenderOffline?: (document: T) => React.ReactNode | undefined;
  onRenderDocumentTemplate?: (row: any) => React.ReactNode | undefined;
  onRenderSummary?: (data: any) => React.ReactNode | undefined;
  isTypeHidden?: boolean;
  parentData?: { [key: string]: IPartialDocument | undefined };
  defaultFilters?: any[];
}

export function DocumentTable<T extends IDocument | IPartialDocument>(
  props: IDocumentTableProps<T>,
) {
  const {
    type,
    paginationText,
    query,
    summaryQuery,
    onInvoked,
    columns: initialColumns,
    transitionMutation,
    onRenderTransition,
    onRenderStatus,
    onRenderType,
    download,
    isSerialNumber,
    isPointer,
    isPaginated,
    isStatusHidden = false,
    isTransitionsHidden = false,
    search,
    searchFields = [],
    isPartialDocument = false,
    isSingleType = false,
    isFiltersHidden = false,
    isStatusFilterHidden = false,
    parentDocumentType,
    stickyColumns: initialStickyColumns,
    stickyColumnsDirection,
    hierarchy,
    onGetHierarchy,
    isSelectHidden = false,
    sortByField = "uniqueNumber",
    filteredData,
    onGetType,
    renderField,
    onRenderFilter,
    onRenderCustomFilter,
    onFilterData,
    onRenderOffline,
    onRenderDocumentTemplate,
    onRenderSummary,
    isTypeHidden = false,
    parentData,
    defaultFilters,
  } = props;
  const { get, types, featureFlags } = useDocumentContext();
  const configuration = get(type);
  const documentTypes = types(parentDocumentType ?? type);
  const {
    entities: { data: documentTemplates },
  } = useDocumentTemplates();
  const { isPermitted } = useACL();

  const [isEnabled, setEnabled] = useState(isFiltersHidden ? true : false);
  const { result, setPagination, setSorting, setSearch, setFilters } = query({
    search: { fields: [...searchFields] },
    isEnabled: isEnabled,
    sorting: [{ id: "uniqueNumber" as any, desc: false }],
    filters: defaultFilters,
  });

  const {
    result: summary,
    setSearch: setSummarySearch,
    setFilters: setSummaryFilters,
  }: any = summaryQuery
    ? summaryQuery({
        search: { fields: [...searchFields] },
        isEnabled: isEnabled,
      })
    : {};

  const [transition, setTransition] = useState<{
    document: T | T[];
    transition: ITransition;
    configuration?: IDocumentConfiguration;
  }>();

  const [view, setView] = useQueryParam("view", StringParam);

  useEffect(() => {
    setSearch?.(search);
    setSummarySearch?.(search);
  }, [search]);

  useEffect(() => {
    if (!view) setView(configuration?.tableViews?.[0]?.name);
  }, [view, configuration?.tableViews]);

  let stickyColumns = initialStickyColumns ?? 0;
  const tableFields = useMemo(() => {
    if (!configuration?.fields || !configuration?.tableViews) return [];

    const defaultView = configuration?.tableViews?.find(
      (tableview) => tableview.name === (view ?? "default"),
    );

    if (!defaultView) return [];

    return configuration?.fields?.filter((f) =>
      defaultView.columns.some((c) => c.field === f.name),
    );
  }, [configuration?.fields, configuration?.tableViews, view]);

  const getTransitions = (
    document: IDocument | IPartialDocument,
    localConfiguration?: IDocumentConfiguration,
  ) =>
    "status" in document
      ? (localConfiguration ?? configuration)?.transitions?.filter((t) => {
          if (t.from !== document?.status) return false;
          if (t.acl.includes("all")) return true;

          return isPermitted(
            t.acl,
            document,
            hierarchy ?? onGetHierarchy?.(document as T),
            parentData,
          );
        })
      : [];

  const getBulkTransitions = (
    ids: string[],
    override: IDocumentConfiguration,
  ) => {
    if (isPartialDocument) return [];

    const data = result.data?.result.filter((item) => ids.includes(item.id));
    const allSameStatusType =
      data &&
      data.length > 0 &&
      data.every(
        (item) =>
          "status" in item &&
          "status" in data[0] &&
          item.status === data[0].status,
      ) &&
      data.every((item) => item.type === data[0].type);

    return allSameStatusType
      ? getTransitions(data[0], override)?.filter((x) => x.bulk !== false)
      : [];
  };

  const handleDownload = async (id: string, row: any) => {
    if (download) {
      const extension = featureFlags.module === "mqf" ? "xlsx" : "pdf";
      const file = await download.mutateAsync({
        uid: row.id,
        documentTemplateId: id,
      });
      saveAs(file, `${row.uniqueNumber}.${extension}`);
    }
  };

  const helper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [];

  if (!isSelectHidden) columns.push(getSelectColumn<T>());

  //TODO this concerns with only the sorting of data returned from the API, need to consider sorting of data in the backend too
  const sortedData = sortByField
    ? _.sortBy(result.data?.result, [sortByField])
    : result.data?.result;

  useEffect(() => {
    if (sortedData) onFilterData?.(sortedData);
  }, [sortedData]);

  const updatedFilteredData = filteredData ?? sortedData;

  if (isSerialNumber) {
    columns.push(
      helper.accessor("sno", {
        header: "S.No",
        cell: (row) => {
          return row.row.index + 1;
        },
        size: 3,
        minSize: 3,
        maxSize: 3,
      }),
    );
  }

  if (!isSingleType && !isTypeHidden) {
    columns.push(
      helper.accessor("type", {
        header: featureFlags.module === "ims" ? "Audit Type" : "Type",
        cell: (row) => {
          return (
            onRenderType?.(row.row.original) ?? (
              <DocumentTypeTag
                type={row.row.original.type}
                documentType={type}
              />
            )
          );
        },
        size: 6,
        minSize: 3,
        maxSize: Number.MAX_SAFE_INTEGER,
      }),
    );
  }

  columns.push(...(initialColumns ?? []));

  tableFields.forEach((field) => {
    columns.push(
      helper.accessor(`fields.${field.name}`, {
        header: field.label,
        cell: (row) => (
          <DocumentFieldView field={field} document={row.row.original} />
        ),
        ...getColumnSize(field.type),
      }),
    );
  });

  if (!isPartialDocument && !isStatusHidden) {
    columns.push(
      helper.accessor("status", {
        header: "Status",
        cell: (row) => {
          return (
            onRenderStatus?.(row.row.original) ?? (
              <DocumentStatusTag
                status={row.getValue()}
                configuration={configuration}
              />
            )
          );
        },
        size: 10,
        minSize: 10,
        maxSize: 10,
      }),
    );
    stickyColumns += 1;
  }

  if (!isPartialDocument && !isTransitionsHidden) {
    columns.push(
      helper.display({
        id: "transitions",
        header: "Actions",
        cell: (row) => {
          const document = row.row.original;

          const Transitions = () => {
            const configuration = get(onGetType?.(document) ?? type);
            const transitions = getTransitions(document, configuration) ?? [];
            const renderTransition = onRenderTransition?.(
              document,
              transitions,
            );

            return (
              <>
                {renderTransition ??
                  transitions.map((transition) => (
                    <TransitionButton
                      key={transition.name}
                      size="icon"
                      transition={transition}
                      onClick={() =>
                        handleTransition(document, transition, configuration)
                      }
                    />
                  ))}
                {transitions.length === 0 && "-"}
              </>
            );
          };

          return (
            <HStack h={"full"} alignItems={"flex-start"}>
              <Transitions />
            </HStack>
          );
        },
        size: 11,
        minSize: 11,
        maxSize: 11,
      }),
    );
    stickyColumns += 1;
  }

  if (download) {
    columns.push(
      helper.display({
        id: "download",
        cell: (row) => (
          <HStack>
            <Menu>
              <MenuButton
                as={Button}
                size={"xs"}
                variant={"outline"}
                isLoading={
                  download.isPending &&
                  download.variables.uid === row.row.original.id
                }
                isDisabled={
                  documentTemplates &&
                  documentTemplates.filter((d) => {
                    return d.documentName === type;
                  }).length === 0
                }
              >
                <Tooltip label={"Download PDF"} placement="left" bg={"#44546f"}>
                  <FileDown size="1rem" color="#42526E" strokeWidth="1.33" />
                </Tooltip>
              </MenuButton>
              <Portal>
                <MenuList>
                  {onRenderDocumentTemplate
                    ? onRenderDocumentTemplate(row.row.original)
                    : documentTemplates
                        ?.filter((d) => d.documentName === type)
                        .map((dt) => (
                          <MenuItem
                            key={dt.id}
                            onClick={() =>
                              handleDownload(dt.id, row.row.original)
                            }
                          >
                            {dt.name}
                          </MenuItem>
                        ))}
                </MenuList>
              </Portal>
            </Menu>
            {onRenderOffline?.(row.row.original)}
          </HStack>
        ),
        size: 5,
        minSize: 5,
        maxSize: 5,
      }),
    );
    stickyColumns += 1;
  }

  const handleTransition = (
    document: IDocument,
    transition: ITransition | undefined,
    override?: IDocumentConfiguration,
  ) => {
    if (!transition) {
      setTransition(undefined);
      return;
    }

    const screen = (override ?? configuration)?.screens?.find(
      (s) => s.name === transition.screen,
    );

    if (
      transition.remarks === "none" &&
      Object.entries(screen?.fields ?? {}).length === 0
    ) {
      transitionMutation?.mutate(
        {
          id: document?.id,
          name: transition.name,
          data: document,
          remarks: "",
        },
        {
          onSuccess: () => setTransition(undefined),
        },
      );
    } else {
      setTransition({
        document: document as T,
        transition,
        configuration: override ?? configuration,
      });
    }
  };

  const defaultFilterField = () => {
    const currentTableView = configuration?.tableViews?.find(
      (tableview) => tableview.name === view,
    );
    const configurationFields = configuration?.fields;

    if (!currentTableView || !configurationFields) return null;

    const matchedFields = currentTableView.filters
      ?.map(({ field }) =>
        configurationFields.find(({ name }) => name === field),
      )
      .filter(Boolean);

    if (!matchedFields?.length) return null;

    return matchedFields.map((field) => {
      if (field?.type === "date" || field?.type === "date-time") {
        const option = timeOptions.find(
          (o) =>
            o.text.trim().toLowerCase() ===
            currentTableView.filters
              ?.find((x) => x.field === field?.name)
              ?.values[0]?.value.toLowerCase()
              .trimEnd(),
        );
        return (
          <DataTableDateTimeFilter
            field={field.name}
            title={field.label ?? ""}
            shifts={[]}
            default={option ? getRelative(option) : undefined}
            offset={0}
          />
        );
      }
      return null;
    });
  };

  const defaultStatusValues =
    configuration?.tableViews && view
      ? configuration.tableViews
          ?.find((tableview) => tableview.name === view)
          ?.filters?.find((filter) => filter.field === "status")
          ?.values.map((value) => value.value) ?? null
      : undefined;

  const filters = onRenderFilter?.();

  return (
    <>
      <HStack>
        {isFiltersHidden ? null : (
          <DataTableToolbar
            onChange={(filters, isLoaded) => {
              setEnabled(isLoaded ?? false);
              setFilters(filters);
              setSummaryFilters?.(filters);
            }}
          >
            {isStatusFilterHidden ? null : (
              <DataTableFilter
                field="status"
                title="Status"
                options={
                  configuration?.statuses?.map((s) => ({
                    label: s.label,
                    value: s.name,
                  })) ?? []
                }
                default={defaultStatusValues ?? null}
              />
            )}
            {!isSingleType && (
              <DataTableFilter
                field="type"
                title={featureFlags.module === "ims" ? "Audit Type" : "Type"}
                options={
                  documentTypes?.map((s) => ({
                    label: s.label,
                    value: s.name,
                  })) ?? []
                }
                default={null}
              />
            )}
            {_.isArray(filters) ? filters.map((filter) => filter) : filters}
            {defaultFilterField()}
          </DataTableToolbar>
        )}
        {onRenderCustomFilter?.()}
      </HStack>
      {onRenderSummary?.(summary)}
      <DataTable<any>
        isLoading={result.isLoading}
        isError={result.isError}
        isPointer={isPointer}
        data={updatedFilteredData}
        count={result.data?.count}
        columns={columns}
        defaultPageSize={25}
        paginationText={paginationText}
        onPagination={isPaginated ? setPagination : undefined}
        onSorting={(column) =>
          setSorting(
            column
              ? column.map((c) => ({ id: c.id as keyof T, desc: c.desc }))
              : undefined,
          )
        }
        onInvoked={(data) => onInvoked?.(data as IDocument)}
        bulkActions={(selectedRows) => {
          const data = result.data?.result.filter((item) =>
            selectedRows.includes(item.id),
          );
          const configuration = get(
            onGetType?.(data?.[0] as IDocument) ?? type,
          );

          return (
            <HStack mr={4}>
              {getBulkTransitions(selectedRows, configuration)?.map(
                (transition) => (
                  <TransitionButton
                    key={transition.name}
                    transition={transition}
                    onClick={() =>
                      setTransition({
                        document:
                          result.data?.result.filter((item) =>
                            selectedRows.includes(item.id),
                          ) ?? [],
                        transition: transition,
                        configuration,
                      })
                    }
                    size="compact"
                  />
                ),
              )}
            </HStack>
          );
        }}
        stickyCount={stickyColumns}
        stickyColumnsDirection={stickyColumnsDirection}
      />
      {transition && transition.configuration && transitionMutation && (
        <TransitionScreen
          isOpen={!!transition}
          onClose={() => setTransition(undefined)}
          data={
            "status" in
            (_.isArray(transition.document)
              ? transition.document[0]
              : transition.document)
              ? (transition.document as IDocument)
              : undefined
          }
          transition={transition.transition}
          configuration={transition.configuration}
          mutate={transitionMutation}
          renderField={renderField}
        />
      )}
    </>
  );
}

export default DocumentTable;
