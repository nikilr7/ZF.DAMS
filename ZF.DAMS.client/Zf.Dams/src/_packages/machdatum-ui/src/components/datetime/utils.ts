import { DateTime } from "luxon";
import { IPeriod } from ".";
import { parse } from "./DateMath";
import { TimeOption } from "./types";
import { QueryParamConfig } from "use-query-params";

export function getRelative(option: TimeOption): IPeriod | undefined {
  const start = parse(option.from, false)?.toJSDate();
  const end = parse(option.to, true)?.toJSDate();

  if (!start || !end) return;
  const relativePeriod: IPeriod = {
    start: DateTime.fromJSDate(start),
    end: DateTime.fromJSDate(end),
    name: option.text,
  };

  return relativePeriod;
}

export const timeOptions: TimeOption[] = [
  { from: "now-2d/d", to: "now-1d/d", text: "Last 2 days", section: 0 },
  { from: "now-7d/d", to: "now-1d/d", text: "Last 7 days", section: 0 },
  { from: "now-30d/d", to: "now-1d/d", text: "Last 30 days", section: 0 },
  { from: "now-90d/d", to: "now-1d/d", text: "Last 90 days", section: 0 },
  { from: "now-6M/d", to: "now-1d/d", text: "Last 6 months", section: 0 },
  { from: "now-1y/d", to: "now-1d/d", text: "Last 1 year", section: 0 },
  { from: "now-2y/d", to: "now-1d/d", text: "Last 2 years", section: 0 },
  { from: "now-5y/d", to: "now-1d/d", text: "Last 5 years", section: 0 },
  { from: "now-1d/d", to: "now-1d/d", text: "Yesterday", section: 1 },
  {
    from: "now-2d/d",
    to: "now-2d/d",
    text: "Day before yesterday",
    section: 1,
  },
  {
    from: "now-7d/d",
    to: "now-7d/d",
    text: "This day last week",
    section: 1,
  },
  { from: "now-1w/w", to: "now-1w/w", text: "Previous week", section: 1 },
  { from: "now-1M/M", to: "now-1M/M", text: "Previous month", section: 1 },
  { from: "now-1y/y", to: "now-1y/y", text: "Previous year", section: 1 },
  { from: "now/d", to: "now/d", text: "Today", section: 2 },
  { from: "now/d", to: "now", text: "Today so far", section: 2 },
  { from: "now/w", to: "now/w", text: "This week", section: 2 },
  { from: "now/w", to: "now", text: "This week so far", section: 2 },
  { from: "now/M", to: "now/M", text: "This month", section: 2 },
  { from: "now/M", to: "now", text: "This month so far", section: 2 },
  { from: "now/y", to: "now/y", text: "This year", section: 2 },
  { from: "now/y", to: "now", text: "This year so far", section: 2 },
];

export const PeriodParam: QueryParamConfig<IPeriod | undefined> = {
  encode: (value: IPeriod | undefined) => {
    if (!value) return undefined;
    return `${value.start.toMillis()}_${value.end.toMillis()}${
      value.name ? `_${value.name}` : ""
    }`;
  },
  decode: (
    value: string | (string | null)[] | null | undefined,
  ): IPeriod | undefined => {
    if (!value) return undefined;
    const [start, end, name] = (value as string).split("_");

    const timeOption = timeOptions.find((option) => option.text === name);

    if (!!timeOption) return getRelative(timeOption);

    return {
      start: DateTime.fromMillis(parseInt(start)),
      end: DateTime.fromMillis(parseInt(end)),
      name,
    };
  },
};
