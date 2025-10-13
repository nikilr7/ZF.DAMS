import React, { useEffect, useState } from "react";
import { useDocumentContext } from "../../context/DocumentConfigurationContext";
import { IDocument, IPartialDocument } from "../../hooks/defs";
import { DataManagerProps, DataManagerResponse } from "../../hooks/types";
import { DataTableToolbar, DataTableFilter } from "../datatable";
import { DateTime } from "luxon";
import { Predicate } from "@syncfusion/ej2-data";
import { IPeriod } from "../datetime";
import Gantt from "./chart/Gantt";

export interface IDocumentChart<T> {
  type: string;
  query: (props: DataManagerProps<T>) => DataManagerResponse<T>;
  isFiltersHidden?: boolean;
  parentDocumentType?: string;
  onRenderFilter?: () => React.ReactNode | undefined;
  isTypeHidden?: boolean;
}

export function DocumentChart<T extends IDocument | IPartialDocument>(
  props: IDocumentChart<T>,
) {
  const {
    type,
    query,
    isFiltersHidden = false,
    parentDocumentType,
    onRenderFilter,
    isTypeHidden = false,
  } = props;
  const { get, types } = useDocumentContext();
  const configuration = get(type);
  const documentTypes = types(parentDocumentType ?? type);

  const [isEnabled, setEnabled] = useState(false);
  const { result, setFilters } = query({
    isEnabled: isEnabled,
    pagination: {
      pageIndex: 0,
      pageSize: 1000000,
    },
  });

  const [period, setPeriod] = useState<IPeriod>(() => {
    const fiscalYearStart =
      DateTime.now().month >= 4
        ? DateTime.local(DateTime.now().year, 4, 1)
        : DateTime.local(DateTime.now().year - 1, 4, 1);
    const fiscalYearEnd = fiscalYearStart.plus({ years: 1 }).minus({ days: 1 });

    return {
      start: fiscalYearStart,
      end: fiscalYearEnd,
      name: "fiscalYear",
    };
  });

  const [predicate, setPredicate] = useState<Predicate[]>([]);
  const [defaultFilter, setDefaultFilter] = useState<Predicate[]>([]);

  useEffect(() => {
    setFilters(() => [...defaultFilter, ...predicate]);
    setEnabled(true);
  }, [predicate, defaultFilter]);

  useEffect(() => {
    if (!period || !configuration?.calendarView) return;

    const currentStart =
      DateTime.isDateTime(period.start) === false
        ? DateTime.fromISO((period.start as any).toString())
        : period.start;

    const currentEnd =
      DateTime.isDateTime(period.end) === false
        ? DateTime.fromISO((period.end as any).toString())
        : period.end;

    const { start, end } = configuration.calendarView;
    if (start && end) {
      setPredicate([
        new Predicate(
          start,
          "greaterthanorequal",
          currentStart.toSeconds(),
        ).and(new Predicate(end, "lessthanorequal", currentEnd.toSeconds())),
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
          {!isTypeHidden && (
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
          )}
          {onRenderFilter?.()}
        </DataTableToolbar>
      )}
      <Gantt
        configuration={configuration}
        documents={result.data?.result ?? []}
        onPeriodChange={setPeriod}
        isLoading={result.isLoading}
        isError={result.isError}
      />
    </>
  );
}

export default DocumentChart;
