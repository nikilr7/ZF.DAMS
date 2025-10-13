import FormField from "../../../components/forms/Field";
import { useController, useWatch } from "react-hook-form";
import DatePicker from "react-datepicker";
import { parse } from "../../../components/datetime/DateMath";
import { DateTime } from "luxon";
import "react-datepicker/dist/react-datepicker.css";
import "@ui/components/datetime/_css/DateTimePicker.css";
import { IFieldProps } from "../../../hooks/defs";

export const DateField = ({
  field,
  isEditable,
  parentField,
  isRequired,
}: IFieldProps) => {
  const { name, label, properties } = field;
  const {
    field: { value, onChange },
  } = useController({ name });

  const data = useWatch();

  const fields: { name: string; value: any }[] = [];
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "object" && value) {
      Object.keys(value).forEach((k) => {
        fields.push({ name: k, value: value[k] });
      });
    }
    fields.push({ name: key, value });
  });

  const parentFields: { name: string; value: any }[] = [];
  if (parentField) {
    Object.entries(parentField).forEach(([key, value]) => {
      parentFields.push({ name: key, value });
    });
  }

  const start =
    parse(
      properties?.["from"],
      false,
      undefined,
      fields,
      parentFields,
    )?.toJSDate() ?? new Date();
  const end = parse(
    properties?.["to"],
    false,
    undefined,
    fields,
    parentFields,
  )?.toJSDate();

  return (
    <FormField name={name} label={label} isRequired={isRequired}>
      {({ error }) => (
        <DatePicker
          minDate={start}
          maxDate={end}
          disabled={!isEditable}
          selected={value && new Date(value)}
          onChange={(date) => onChange(date)}
          dateFormat={"dd MMM yyyy"}
          className={error && "error"}
          portalId="root-portal"
          popperPlacement="bottom-start"
          todayButton="Today"
        />
      )}
    </FormField>
  );
};

export const DateTimeField = ({
  field,
  isEditable,
  parentField,
  isRequired,
}: IFieldProps) => {
  const { name, label, properties } = field;
  const {
    field: { value, onChange },
  } = useController({ name });

  const data = useWatch();

  const fields: { name: string; value: any }[] = [];
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "object" && value) {
      Object.keys(value).forEach((k) => {
        fields.push({ name: k, value: value[k] });
      });
    }
    fields.push({ name: key, value });
  });

  const parentFields: { name: string; value: any }[] = [];
  if (parentField) {
    Object.entries(parentField).forEach(([key, value]) => {
      parentFields.push({ name: key, value });
    });
  }

  const start =
    parse(
      properties?.["from"],
      false,
      undefined,
      fields,
      parentFields,
    )?.toJSDate() ?? new Date();
  const end = parse(
    properties?.["to"],
    false,
    undefined,
    fields,
    parentFields,
  )?.toJSDate();

  const calculateMinTime = (): Date => {
    if (
      value &&
      start &&
      DateTime.fromJSDate(value).startOf("day").toMillis() ===
        DateTime.fromJSDate(start).startOf("day").toMillis()
    ) {
      return start as Date;
    }

    return DateTime.now().startOf("day").toJSDate();
  };

  const calculateMaxTime = (): Date => {
    if (
      value &&
      end &&
      DateTime.fromJSDate(value).startOf("day").toMillis() ===
        DateTime.fromJSDate(end).startOf("day").toMillis()
    ) {
      return end;
    }

    return DateTime.now().endOf("day").toJSDate();
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      onChange(null);
      return;
    }
    onChange(date.toISOString());
  };

  return (
    <FormField name={name} label={label} isRequired={isRequired}>
      {({ error }) => (
        <DatePicker
          minDate={start}
          maxDate={end}
          minTime={calculateMinTime()}
          maxTime={calculateMaxTime()}
          disabled={!isEditable}
          popperClassName="with-time"
          selected={value ? new Date(value) : null}
          onChange={handleDateChange}
          dateFormat={"dd MMM yyyy HH:mm"}
          timeFormat="HH:mm"
          showTimeSelect
          className={error && "error"}
          portalId="root-portal"
          popperPlacement="bottom-start"
          todayButton="Today"
        />
      )}
    </FormField>
  );
};
