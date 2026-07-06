import React from "react";
import { Box, Text, Newline } from "ink";
import { Color, BOLD, RESET } from "../color";
import { renderDigit, renderColon, renderEmpty } from "../character";

interface ClockDisplayProps {
  hour: number;
  minute: number;
  second: number;
  color: Color;
  blink: boolean;
  bold: boolean;
  use12h: boolean;
  hideSeconds: boolean;
  subtitle: string;
  paddingTop: number;
  paddingLeft: number;
}

const CLOCK_WIDTH = 51;
const CLOCK_WIDTH_NO_SECONDS = 32;
const CLOCK_HEIGHT = 7;
const AM_SUFFIX = " [AM]";
const PM_SUFFIX = " [PM]";

export function isClockTooLarge(
  termWidth: number,
  termHeight: number,
  hideSeconds: boolean
): boolean {
  const width = hideSeconds ? CLOCK_WIDTH_NO_SECONDS : CLOCK_WIDTH;
  return width + 1 >= termWidth || CLOCK_HEIGHT + 1 >= termHeight;
}

export function calculatePadding(
  termWidth: number,
  termHeight: number,
  hideSeconds: boolean,
  xPos: (total: number, offset: number) => number,
  yPos: (total: number, offset: number) => number,
  _subtitleLen: number
): { top: number; left: number } {
  const cw = hideSeconds ? CLOCK_WIDTH_NO_SECONDS : CLOCK_WIDTH;
  const halfWidth = Math.floor(cw / 2);
  const top = yPos(termHeight, Math.floor(CLOCK_HEIGHT / 2));
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
  subtitle,
  paddingTop,
  paddingLeft,
}: ClockDisplayProps) {
  let displayHour = hour;
  const suffix = use12h
    ? hour < 12 ? AM_SUFFIX : PM_SUFFIX
    : "";

  if (use12h) {
    if (displayHour > 12) {
      displayHour -= 12;
    } else if (displayHour === 0) {
      displayHour = 12;
    }
  }

  const leftPad = " ".repeat(paddingLeft);

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

  const clockWidth = hideSeconds ? CLOCK_WIDTH_NO_SECONDS : CLOCK_WIDTH;
  const totalTextLen = subtitle.length + suffix.length;
  const textHalfWidth = Math.floor(Math.max(0, clockWidth - totalTextLen) / 2);
  const textPad = " ".repeat(Math.max(0, paddingLeft + textHalfWidth));
  const subtitleText = subtitle + suffix;

  return (
    <Box flexDirection="column">
      {Array.from({ length: paddingTop }, (_, i) => (
        <Text key={`pad-${i}`}>{" ".repeat(Math.max(0, paddingLeft))}</Text>
      ))}
      {rows}
      <Newline />
      <Text>
        {bold ? BOLD : ""}
        {textPad}
        {color.foreground()}
        {subtitleText}
        {RESET}
      </Text>
    </Box>
  );
}
