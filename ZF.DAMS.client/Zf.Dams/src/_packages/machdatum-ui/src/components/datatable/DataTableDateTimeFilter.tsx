import { Button } from "@chakra-ui/react";
import { Filter } from "lucide-react";
import PeriodSelector from "../datetime/PeriodSelector";
import { IPeriod, IShift } from "../datetime/types";
import { Predicate } from "@syncfusion/ej2-data";
import { useEffect } from "react";
import { PeriodParam } from "../datetime";
import { useQueryParam } from "use-query-params";

interface IProps {
  field: string;
  title: string;
  shifts: IShift[];
  offset: number;
  default?: IPeriod | null | undefined;
  onChange?: (predicate: Predicate | null | undefined) => void;
}

function DataTableDateTimeFilter(props: IProps) {
  const { field, default: defaultPeriod, shifts, offset, onChange } = props;
  const [period, setPeriod] = useQueryParam<IPeriod | undefined>(
    field,
    PeriodParam,
  );

  useEffect(() => {
    if (!period && defaultPeriod) setPeriod(defaultPeriod);
  }, [defaultPeriod, period]);

  useEffect(() => {
    if (period) {
      const startPredicate = new Predicate(
        field,
        "greaterthanorequal",
        period.start.toISO(),
      );

      const endPredicate = new Predicate(
        field,
        "lessthanorequal",
        period.end.toISO(),
      );
      onChange?.(startPredicate.and(endPredicate));
    } else {
      onChange?.(undefined);
    }
  }, [period]);

  const view = (displayPeriod: string) => {
    return (
      <Button
        leftIcon={<Filter size="1rem" color="#42526E" strokeWidth="1.33" />}
        variant="outline" 
      >
        {displayPeriod}
      </Button>
    );
  };

  return (
    <PeriodSelector
      period={period ?? undefined}
      shifts={shifts}
      offset={offset}
      onChange={setPeriod}
      view={view}
    />
  );
}

export type { IProps as DataTableDateTimeFilterProps };

export default DataTableDateTimeFilter;
