import React from "react";
import { Box, Text, Newline } from "ink";
import { Color, BOLD, RESET } from "../color";
import { renderDigit, renderColon, renderEmpty } from "../character";
import { getClockFontHeight, getClockFontWidth, renderFigletClock } from "./fontRenderer";

interface ClockDisplayProps {
  hour: number;
  minute: number;
  second: number;
  color: Color;
  blink: boolean;
  bold: boolean;
  use12h: boolean;
  hideSeconds: boolean;
  font: string;
  subtitle: string;
  paddingTop: number;
  paddingLeft: number;
}

const AM_SUFFIX = " [AM]";
const PM_SUFFIX = " [PM]";

export function getClockHeight(font: string): number {
  return getClockFontHeight(font);
}

export function getClockWidth(font: string, hideSeconds: boolean): number {
  return getClockFontWidth(font, hideSeconds);
}

export function isClockTooLarge(
  termWidth: number,
  termHeight: number,
  font: string,
  hideSeconds: boolean
): boolean {
  const width = getClockWidth(font, hideSeconds);
  const height = getClockHeight(font);
  return width + 1 >= termWidth || height + 1 >= termHeight;
}

export function calculatePadding(
  termWidth: number,
  termHeight: number,
  font: string,
  hideSeconds: boolean,
  xPos: (total: number, offset: number) => number,
  yPos: (total: number, offset: number) => number,
  _subtitleLen: number
): { top: number; left: number } {
  const cw = getClockWidth(font, hideSeconds);
  const ch = getClockHeight(font);
  const halfWidth = Math.floor(cw / 2);
  const top = yPos(termHeight, Math.floor(ch / 2));
  const left = xPos(termWidth, halfWidth);
  return { top, left };
}

export function ClockDisplay({
  hour,
  minute,
  second,
  color,
  blink,
  bold,
  use12h,
  hideSeconds,
  font,
  subtitle,
  paddingTop,
  paddingLeft,
}: ClockDisplayProps) {
  const leftPad = " ".repeat(paddingLeft);
  const clockWidth = getClockWidth(font, hideSeconds);
  const clockHeight = getClockFontHeight(font);

  const suffix = use12h
    ? hour < 12 ? AM_SUFFIX : PM_SUFFIX
    : "";

  let displayHour = hour;
  if (use12h) {
    if (displayHour > 12) {
      displayHour -= 12;
    } else if (displayHour === 0) {
      displayHour = 12;
    }
  }

  const hh = String(displayHour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  const ss = hideSeconds ? null : String(second).padStart(2, "0");

  const isFiglet = font !== "digital";
  const fgColor = color.foreground();
  const boldEscape = bold ? BOLD : "";

  const renderRows = (): React.ReactNode[] => {
    if (isFiglet) {
      const figletRows = renderFigletClock(hh, mm, ss, font, blink, second);
      return figletRows.map((row, i) => (
        <Text key={`row-${i}`}>
          {leftPad}{boldEscape}{fgColor}{row}{RESET}
        </Text>
      ));
    }

    // 7-segment digital rendering
    const rows: React.ReactNode[] = [];
    for (let row = 0; row < 5; row++) {
      const colonChar =
        blink && (second & 1) === 1
          ? renderEmpty(color, row)
          : renderColon(color, row);

      const h0 = renderDigit(Math.floor(displayHour / 10), color, row);
      const h1 = renderDigit(displayHour % 10, color, row);
      const m0 = renderDigit(Math.floor(minute / 10), color, row);
      const m1 = renderDigit(minute % 10, color, row);

      let line = leftPad + h0 + h1 + colonChar + m0 + m1;

      if (!hideSeconds) {
        const s0 = renderDigit(Math.floor(second / 10), color, row);
        const s1 = renderDigit(second % 10, color, row);
        line += colonChar + s0 + s1;
      }

      rows.push(<Text key={`row-${row}`}>{line}</Text>);
    }
    return rows;
  };

  const totalTextLen = subtitle.length + suffix.length;
  const textHalfWidth = Math.floor(Math.max(0, clockWidth - totalTextLen) / 2);
  const textPad = " ".repeat(Math.max(0, paddingLeft + textHalfWidth));
  const subtitleText = subtitle + suffix;

  return (
    <Box flexDirection="column">
      {Array.from({ length: paddingTop }, (_, i) => (
        <Text key={`pad-${i}`}>{" ".repeat(Math.max(0, paddingLeft))}</Text>
      ))}
      {renderRows()}
      <Newline />
      <Text>
        {boldEscape}
        {textPad}
        {fgColor}
        {subtitleText}
        {RESET}
      </Text>
    </Box>
  );
}
