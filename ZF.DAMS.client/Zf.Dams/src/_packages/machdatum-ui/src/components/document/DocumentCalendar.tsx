import React, { useEffect, useState } from "react";
import { useDocumentContext } from "../../context/DocumentConfigurationContext";
import { IDocument, IPartialDocument } from "../../hooks/defs";
import { DataManagerProps, DataManagerResponse } from "../../hooks/types";
import { DataTableToolbar, DataTableFilter } from "../datatable";
import Calendar from "./calendar/Calendar";
import { DateTime } from "luxon";
import { Predicate } from "@syncfusion/ej2-data";
import { IPeriod } from "../datetime";

export interface IDocumentCalendarProps<T> {
  type: string;
  query: (props: DataManagerProps<T>) => DataManagerResponse<T>;
  onInvoked?: (document: IPartialDocument | IDocument) => void;
  search?: string | undefined;
  searchFields?: string[];
  isFiltersHidden?: boolean;
  isStatusFilterHidden?: boolean;
  parentDocumentType?: string;
  onRenderFilter?: () => React.ReactNode | React.ReactNode[] | undefined;
  onRenderTitle?: (document: IPartialDocument | IDocument) => React.ReactNode;
  onRenderTooltip?: (document: IPartialDocument | IDocument) => React.ReactNode;
}

export function DocumentCalendar<T extends IDocument | IPartialDocument>(
  props: IDocumentCalendarProps<T>,
) {
  const {
    type,
    query,
    onInvoked,
    search,
    searchFields = [],
    isFiltersHidden = false,
    isStatusFilterHidden = false,
    parentDocumentType,
    onRenderFilter,
    onRenderTitle,
    onRenderTooltip,
  } = props;
  const { get, types } = useDocumentContext();
  const configuration = get(type);
  const documentTypes = types(parentDocumentType ?? type);

  const [isEnabled, setEnabled] = useState(false);
  const { result, setSearch, setFilters } = query({
    search: { fields: [...searchFields] },
    isEnabled: isEnabled,
    pagination: {
      pageIndex: 0,
      pageSize: 1000000,
    },
  });

  const [period, setPeriod] = useState<IPeriod>({
    start: DateTime.now().startOf("month"),
    end: DateTime.now().endOf("month"),
    name: "defaultRange",
  });

  const [predicate, setPredicate] = useState<Predicate[]>([]);
  const [defaultFilter, setDefaultFilter] = useState<Predicate[]>([]);

  useEffect(() => {
    setFilters(() => [...defaultFilter, ...predicate]);
    setEnabled(true);
  }, [predicate, defaultFilter]);

  useEffect(() => {
    setSearch?.(search);
  }, [search]);

  useEffect(() => {
    if (!period || !configuration?.calendarView) return;

    const { start, end } = configuration.calendarView;
    if (start && end) {
      setPredicate([
        new Predicate(
          start,
          "greaterthanorequal",
          period.start.toSeconds(),
        ).and(new Predicate(end, "lessthanorequal", period.end.toSeconds())),
      ]);
    }
  }, [period]);

  return (
    <>
      {isFiltersHidden ? null : (
        <DataTableToolbar
          onChange={(filters) => {
            setDefaultFilter(filters);
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
            />
          )}
          <DataTableFilter
            field="type"
            title="Type"
            options={
              documentTypes?.map((s) => ({
                label: s.label,
                value: s.name,
              })) ?? []
            }
            default={null}
          />
          {onRenderFilter?.()}
        </DataTableToolbar>
      )}
      <Calendar<any>
        documents={result.data?.result ?? []}
        onSelected={(document) => onInvoked?.(document)}
        onRenderTitle={onRenderTitle}
        onRenderTooltip={onRenderTooltip}
        type={type}
        onPeriodChange={setPeriod}
      />
    </>
  );
}

export default DocumentCalendar;
