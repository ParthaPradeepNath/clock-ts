import { Counter } from "./counter";
import { formatDate, getTime, TimeZoneKind } from "./timeZone";
import { DateFormatTooWideError } from "../error";

export type ClockMode =
  | { type: "counter"; counter: Counter }
  | { type: "time"; timeZone: TimeZoneKind; dateFormat: string };

export function getClockTime(mode: ClockMode): [number, number, number] {
  if (mode.type === "counter") {
    return mode.counter.getTime();
  }
  return getTime(mode.timeZone);
}

export function getClockText(mode: ClockMode, maxLen: number): string {
  if (mode.type === "counter") {
    return mode.counter.text;
  }
  const text = formatDate(mode.timeZone, mode.dateFormat);
  if (text.length > maxLen) {
    throw new DateFormatTooWideError(text.length, maxLen);
  }
  return text;
}
