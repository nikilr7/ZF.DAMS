import isDate from "lodash/isDate";
import {
  dateTime,
  dateTimeForTimeZone,
  isDateTime,
  ISO_8601,
} from "./LuxonWrapper";
import { TimeZone } from "./types";
import { DateTime as LuxonDateTime } from "luxon";

const unitMap: Record<string, string> = {
  y: "years",
  M: "months",
  w: "weeks",
  d: "days",
  h: "hours",
  m: "minutes",
  s: "seconds",
};

/**
 * Parses different types input to a moment instance. There is a specific formatting language that can be used
 * if text arg is string. See unit tests for examples.
 * @param text
 * @param roundUp See parseDateMath function.
 * @param timezone Only string 'utc' is acceptable here, for anything else, local timezone is used.
 */
export function parse(
  text?: string | LuxonDateTime | Date | null,
  roundUp?: boolean,
  timezone?: TimeZone,
  data?: { name: string; value: any }[],
  parentData?: { name: string; value: any }[],
): LuxonDateTime | undefined {
  if (!text) return undefined;

  if (typeof text !== "string") {
    if (isDateTime(text)) return text;

    if (isDate(text)) return dateTime(text);

    // We got some non string which is not a moment nor Date. TS should be able to check for that but not always.
    return undefined;
  }

  let time: LuxonDateTime | undefined;
  let mathString = "";
  let index;
  let parseString;
  let result = undefined;
  let parentResult = undefined;

  (data ?? []).forEach((field) => {
    if (text.indexOf(field.name) === 0) {
      time = dateTime(field.value);
      mathString = text.substring(field.name.length);

      if (time) result = parseDateMath(mathString, time, roundUp);
    }
  });

  if (result) return result;

  (parentData ?? []).forEach((field) => {
    if (text.indexOf(field.name) === 0) {
      time = dateTime(field.value);
      mathString = text.substring(field.name.length);

      if (time) parentResult = parseDateMath(mathString, time, roundUp);
    }
  });

  if (parentResult) return parentResult;

  if (text.substring(0, 3) === "now") {
    time = dateTimeForTimeZone(timezone);
    mathString = text.substring("now".length);
  } else {
    index = text.indexOf("||");
    if (index === -1) {
      parseString = text;
      mathString = ""; // nothing else
    } else {
      parseString = text.substring(0, index);
      mathString = text.substring(index + 2);
    }
    // We're going to just require ISO8601 timestamps, k?
    time = dateTime(parseString, ISO_8601);
  }

  if (!mathString.length) return time;

  return parseDateMath(mathString, time, roundUp);
}

/**
 * Checks if text is a valid date which in this context means that it is either a Moment instance or it can be parsed
 * by parse function. See parse function to see what is considered acceptable.
 * @param text
 */
export function isValid(text: string | LuxonDateTime): boolean {
  const date = parse(text);
  return date ? date.isValid : false;
}

/**
 * Parses math part of the time string and shifts supplied time according to that math. See unit tests for examples.
 * @param mathString
 * @param time
 * @param roundUp If true it will round the time to endOf time unit, otherwise to startOf time unit.
 */
// TODO: Had to revert Andrejs `time: moment.Moment` to `time: any`
function parseDateMath(
  mathString: string,
  time: LuxonDateTime,
  roundUp?: boolean,
): LuxonDateTime | undefined {
  const strippedMathString = mathString.replace(/\s/g, "");
  let dateTime = time;
  let i = 0;
  const len = strippedMathString.length;

  while (i < len) {
    const c = strippedMathString.charAt(i++);
    let type;
    let num;
    let unit;

    if (c === "/") type = 0;
    else if (c === "+") type = 1;
    else if (c === "-") type = 2;
    else return undefined;

    if (isNaN(parseInt(strippedMathString.charAt(i), 10))) num = 1;
    else if (strippedMathString.length === 2)
      num = strippedMathString.charAt(i);
    else {
      const numFrom = i;
      while (!isNaN(parseInt(strippedMathString.charAt(i), 10))) {
        i++;
        if (i > 10) return undefined;
      }
      num = parseInt(strippedMathString.substring(numFrom, i), 10);
    }

    if (type === 0)
      if (num !== 1)
        // rounding is only allowed on whole, single, units (eg M or 1M, not 0.5M or 2M)
        return undefined;

    unit = strippedMathString.charAt(i++);

    if (!(unit in unitMap)) return undefined;

    const luxonUnit = unitMap[unit];

    if (type === 0) {
      dateTime = roundUp
        ? dateTime.endOf(luxonUnit as any)
        : dateTime.startOf(luxonUnit as any);
    } else if (type === 1) dateTime = dateTime.plus({ [luxonUnit]: num });
    else if (type === 2) dateTime = dateTime.minus({ [luxonUnit]: num });
  }
  return dateTime;
}
