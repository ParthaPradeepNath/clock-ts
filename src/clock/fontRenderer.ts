import figlet from "figlet";

export const FONT_NAMES = [
  "standard", "big", "doom", "slant", "block", "banner",
  "small", "lean", "shadow", "rectangles",
] as const;

export type FigletFontName = (typeof FONT_NAMES)[number];
export type FontName = FigletFontName | "digital";

export function isValidFont(name: string): name is FontName {
  return name === "digital" || (FONT_NAMES as readonly string[]).includes(name);
}

const CHAR_CACHE = new Map<string, Map<string, string[]>>();

function getFigletChar(font: string, char: string): string[] {
  let fontCache = CHAR_CACHE.get(font);
  if (!fontCache) {
    fontCache = new Map();
    CHAR_CACHE.set(font, fontCache);
  }

  let lines = fontCache.get(char);
  if (!lines) {
    const result = figlet.textSync(char, { font: font as any });
    lines = result.split("\n");
    while (lines.length > 0 && lines[lines.length - 1] === "") {
      lines = lines.slice(0, -1);
    }
    fontCache.set(char, lines);
  }

  return lines;
}

export function getClockFontHeight(font: string): number {
  if (font === "digital") return 5;
  return getFigletChar(font, "0").length;
}

export function getClockFontWidth(font: string, hideSeconds: boolean): number {
  if (font === "digital") {
    return hideSeconds ? 32 : 51;
  }

  let maxDigitWidth = 0;
  for (let i = 0; i <= 9; i++) {
    const d = getFigletChar(font, String(i));
    for (const line of d) {
      maxDigitWidth = Math.max(maxDigitWidth, line.length);
    }
  }

  const colonLines = getFigletChar(font, ":");
  let colonWidth = 0;
  for (const line of colonLines) {
    colonWidth = Math.max(colonWidth, line.length);
  }
  if (colonWidth === 0) colonWidth = maxDigitWidth;

  const digitCount = hideSeconds ? 4 : 6;
  const colonCount = hideSeconds ? 1 : 2;

  return maxDigitWidth * digitCount + colonWidth * colonCount;
}

export function renderFigletClock(
  hh: string,
  mm: string,
  ss: string | null,
  font: string,
  blink: boolean,
  second: number
): string[] {
  if (font === "digital") return [];

  const height = getClockFontHeight(font);
  const hh0 = getFigletChar(font, hh[0]);
  const hh1 = getFigletChar(font, hh[1]);
  const colon = getFigletChar(font, ":");
  const mm0 = getFigletChar(font, mm[0]);
  const mm1 = getFigletChar(font, mm[1]);

  const doBlink = blink && (second & 1) === 1;

  const rows: string[] = [];
  for (let i = 0; i < height; i++) {
    let row = (hh0[i] || "") + (hh1[i] || "");
    row += doBlink ? "".padEnd((colon[i] || "").length, " ") : (colon[i] || "");
    row += (mm0[i] || "") + (mm1[i] || "");

    if (ss !== null) {
      const ss0 = getFigletChar(font, ss[0]);
      const ss1 = getFigletChar(font, ss[1]);
      row += doBlink ? "".padEnd((colon[i] || "").length, " ") : (colon[i] || "");
      row += (ss0[i] || "") + (ss1[i] || "");
    }

    rows.push(row);
  }

  return rows;
}
