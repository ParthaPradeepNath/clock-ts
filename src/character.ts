import { Color } from "./color";
import { SegmentType, renderSegment } from "./segment";

const COLON_SEGMENTS: SegmentType[] = [
  SegmentType.Empty,
  SegmentType.Center,
  SegmentType.Empty,
  SegmentType.Center,
  SegmentType.Empty,
];

const NUMBER_SEGMENTS: SegmentType[] = [
  SegmentType.Full, SegmentType.Sides, SegmentType.Sides, SegmentType.Sides, SegmentType.Full,
  SegmentType.Right, SegmentType.Right, SegmentType.Right, SegmentType.Right, SegmentType.Right,
  SegmentType.Full, SegmentType.Right, SegmentType.Full, SegmentType.Left, SegmentType.Full,
  SegmentType.Full, SegmentType.Right, SegmentType.Full, SegmentType.Right, SegmentType.Full,
  SegmentType.Sides, SegmentType.Sides, SegmentType.Full, SegmentType.Right, SegmentType.Right,
  SegmentType.Full, SegmentType.Left, SegmentType.Full, SegmentType.Right, SegmentType.Full,
  SegmentType.Full, SegmentType.Left, SegmentType.Full, SegmentType.Sides, SegmentType.Full,
  SegmentType.Full, SegmentType.Right, SegmentType.Right, SegmentType.Right, SegmentType.Right,
  SegmentType.Full, SegmentType.Sides, SegmentType.Full, SegmentType.Sides, SegmentType.Full,
  SegmentType.Full, SegmentType.Sides, SegmentType.Full, SegmentType.Right, SegmentType.Full,
];

export function renderDigit(digit: number, color: Color, row: number): string {
  const idx = digit * 5 + row;
  return renderSegment(NUMBER_SEGMENTS[idx], color);
}

export function renderColon(color: Color, row: number): string {
  return renderSegment(COLON_SEGMENTS[row], color);
}

export function renderEmpty(color: Color, _row: number): string {
  return renderSegment(SegmentType.Empty, color);
}
