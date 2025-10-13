import { DateTime as LuxonDateTime } from "luxon";
import { TimeZone } from "./types";

export const ISO_8601 = "yyyy-MM-dd'T'HH:mm:ss.SSSZZ";

type DateTimeInput =
  | Date
  | string
  | number
  | Array<string | number>
  | LuxonDateTime;

type FormatInput = string | undefined;

export const isDateTime = (value: any): value is LuxonDateTime => {
  return value instanceof LuxonDateTime;
};

export const dateTime = (
  input?: DateTimeInput,
  formatInput?: FormatInput,
): LuxonDateTime => {
  if (!input) return LuxonDateTime.now();
  if (input instanceof LuxonDateTime) return input;
  if (input instanceof Date) return LuxonDateTime.fromJSDate(input);
  if (typeof input === "number") return LuxonDateTime.fromMillis(input);

  if (Array.isArray(input)) {
    return LuxonDateTime.fromObject({
      year: Number(input[0]),
      month: Number(input[1] || 1),
      day: Number(input[2] || 1),
      hour: Number(input[3] || 0),
      minute: Number(input[4] || 0),
      second: Number(input[5] || 0),
    });
  }

  if (typeof input === "string") {
    return formatInput
      ? LuxonDateTime.fromFormat(input, formatInput)
      : LuxonDateTime.fromISO(input);
  }

  return input;
};

export const dateTimeForTimeZone = (
  timezone?: TimeZone,
  input?: DateTimeInput,
  formatInput?: FormatInput,
): LuxonDateTime => {
  let dt = dateTime(input, formatInput);

  return timezone === "utc" ? dt.toUTC() : dt;
};

export type DurationUnit =
  | "year"
  | "years"
  | "y"
  | "month"
  | "months"
  | "M"
  | "week"
  | "weeks"
  | "w"
  | "day"
  | "days"
  | "d"
  | "hour"
  | "hours"
  | "h"
  | "minute"
  | "minutes"
  | "m"
  | "second"
  | "seconds"
  | "s"
  | "millisecond"
  | "milliseconds"
  | "ms"
  | "quarter"
  | "quarters"
  | "Q";
