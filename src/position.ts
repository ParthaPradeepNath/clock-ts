export enum Position {
  Start = "start",
  Center = "center",
  End = "end",
}

export function calculatePosition(pos: Position, total: number, offset: number): number {
  switch (pos) {
    case Position.Start:
      return 1;
    case Position.Center:
      return Math.floor(total / 2) - offset;
    case Position.End:
      return total - offset * 2 - 2;
  }
}

export function parsePosition(s: string): Position {
  const lower = s.toLowerCase();
  if (lower === "start") return Position.Start;
  if (lower === "center") return Position.Center;
  if (lower === "end") return Position.End;
  throw new Error(`invalid position \`${s}\`, expected start, center, or end`);
}
