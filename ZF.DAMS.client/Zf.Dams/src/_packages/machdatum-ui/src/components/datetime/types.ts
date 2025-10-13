import { DateTime } from "luxon";

type TimeZoneUtc = "utc";
type TimeZoneBrowser = "browser";
export type TimeZone = TimeZoneBrowser | TimeZoneUtc | string;

export type Range =
  | "shift"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom"
  | "relative";

export interface IPeriod {
  start: DateTime;
  end: DateTime;
  name?: string;
}

export interface IShift {
  name: string;
  startTime: string;
  endTime: string;
}

export interface TimeOption {
  from: string;
  to: string;
  text: string;
  section: number;
  isOffset?: boolean;
}
