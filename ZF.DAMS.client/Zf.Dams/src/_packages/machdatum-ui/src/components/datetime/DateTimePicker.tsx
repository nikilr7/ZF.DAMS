import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { Button, Select, VStack } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { IPeriod, Range, IShift } from "./types";
import "react-datepicker/dist/react-datepicker.css";
import "./_css/DateTimePicker.css";

interface IProps {
  range: Range;
  period: IPeriod | undefined;
  shifts: IShift[];
  onChange: (period: IPeriod) => void;
}

export default function DateTimePicker(props: IProps) {
  const { range, period, shifts, onChange } = props;

  const [startDate, setStartDate] = useState<DateTime>();
  const [endDate, setEndDate] = useState<DateTime>();
  const [shift, setShift] = useState<string>();

  useEffect(() => {
    setStartDate(period?.start);
    setEndDate(period?.end);
  }, [period]);

  let configuration: any = {
    selected: startDate?.toJSDate(),
    onChange: () => {},
    dateFormat: "dd MMM yyyy",
    placeholderText: "Select Day",
  };

  switch (range) {
    case "shift":
      configuration = {
        ...configuration,
        onChange: (date: Date) => {
          setStartDate(DateTime.fromJSDate(date));
          setShift("");
        },
      };
      break;
    case "daily":
      configuration = {
        ...configuration,
        onChange: (date: Date) => {
          onChange({
            start: DateTime.fromJSDate(date).startOf("day"),
            end: DateTime.fromJSDate(date).endOf("day"),
            name: "daily",
          });
        },
      };
      break;
    case "weekly":
      configuration = {
        ...configuration,
        showWeekNumbers: true,
        showWeekPicker: true,
        dateFormat: "'Week' I/R",
        placeholderText: "Select Week",
        onChange: (date: Date) => {
          onChange({
            start: DateTime.fromJSDate(date).startOf("week"),
            end: DateTime.fromJSDate(date).endOf("week"),
            name: "weekly",
          });
        },
      } as any;
      break;
    case "monthly":
      configuration = {
        ...configuration,
        onChange: (date: Date) => {
          onChange({
            start: DateTime.fromJSDate(date).startOf("month"),
            end: DateTime.fromJSDate(date).endOf("month"),
            name: "monthly",
          });
        },
        showMonthYearPicker: true,
        dateFormat: "MMM yyyy",
        placeholderText: "Select Month",
      };
      break;
    case "yearly":
      configuration = {
        ...configuration,
        onChange: (date: Date) => {
          onChange({
            start: DateTime.fromJSDate(date).startOf("year"),
            end: DateTime.fromJSDate(date).endOf("year"),
            name: "yearly",
          });
        },
        showYearPicker: true,
        dateFormat: "yyyy",
        placeholderText: "Select Year",
      };
      break;
  }

  const onShiftChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShift(e.target.value);
    const shiftObj = shifts.find((s) => s.name === e.target.value);
    if (shiftObj && startDate) onChange(getShiftPeriod(shiftObj, startDate));
  };

  const isRelative = range === "relative";
  const formatWeekDay = (nameOfDay: string) =>
    nameOfDay.slice(0, 3).toUpperCase();

  const datePickerProps: any = {
    formatWeekDay,
    showTimeSelect: true,
    calendarStartDay: 1,
    disabled: isRelative,
    dateFormat: "dd MMM yyyy HH:mm",
    timeFormat: "HH:mm",
    onChange: () => {},
  };

  return (
    <VStack key={range} w="full">
      {range === "custom" || range === "relative" ? (
        <>
          <DatePicker
            {...datePickerProps}
            selected={
              isRelative ? period?.start.toJSDate() : startDate?.toJSDate()
            }
            onChange={(date: Date) => setStartDate(DateTime.fromJSDate(date))}
            placeholderText="Select Start"
          />
          <DatePicker
            {...datePickerProps}
            selected={isRelative ? period?.end.toJSDate() : endDate?.toJSDate()}
            onChange={(date: Date) => setEndDate(DateTime.fromJSDate(date))}
            placeholderText="Select End"
          />
          {range === "custom" && (
            <Button
              alignSelf={"flex-end"}
              onClick={() =>
                !!startDate &&
                !!endDate &&
                onChange({
                  start: startDate,
                  end: endDate,
                  name: "custom",
                })
              }
            >
              Apply
            </Button>
          )}
        </>
      ) : (
        <DatePicker
          key={range}
          formatWeekDay={formatWeekDay}
          calendarStartDay={1}
          {...configuration}
        />
      )}
      {range === "shift" && (
        <Select
          value={shift}
          onChange={onShiftChange}
          placeholder="Select Shift"
        >
          {shifts?.map((shift, i) => (
            <option key={i} value={shift.name}>
              {shift.name}
            </option>
          ))}
        </Select>
      )}
    </VStack>
  );
}

function getShiftPeriod(shift: IShift, date: DateTime): IPeriod {
  const dateString = date.toISODate();

  let startDate = DateTime.fromISO(`${dateString}T${shift.startTime}`);
  let endDate = DateTime.fromISO(`${dateString}T${shift.endTime}`);

  if (endDate < startDate) {
    endDate = endDate.plus({ days: 1 });
  }

  return {
    start: startDate,
    end: endDate,
    name: shift.name,
  };
}
