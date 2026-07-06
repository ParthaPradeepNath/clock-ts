import { Color, RESET } from "./color";

export enum SegmentType {
  Full,
  Left,
  Center,
  Right,
  Sides,
  Empty,
}

export function renderSegment(type: SegmentType, color: Color): string {
  const bg = color.background();
  switch (type) {
    case SegmentType.Full:
      return `${bg}      ${RESET} `;
    case SegmentType.Left:
      return `${bg}  ${RESET}     `;
    case SegmentType.Center:
      return ` ${bg}  ${RESET}  `;
    case SegmentType.Right:
      return `    ${bg}  ${RESET} `;
    case SegmentType.Sides:
      return `${bg}  ${RESET}  ${bg}  ${RESET} `;
    case SegmentType.Empty:
      return "     ";
  }
}
