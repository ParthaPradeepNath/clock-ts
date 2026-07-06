export const RESET = "\x1B[0m";
export const BOLD = "\x1B[1m";

const POSSIBLE_VALUES = [
  "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white",
  "bright-black", "bright-red", "bright-green", "bright-yellow",
  "bright-blue", "bright-magenta", "bright-cyan", "bright-white",
  "#rrggbb",
] as const;

export type ColorName = (typeof POSSIBLE_VALUES)[number];

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export type ColorValue = string | RgbColor;

const NAMED_COLORS: Record<string, { fg: number; bg: number }> = {
  black:         { fg: 30, bg: 40 },
  red:           { fg: 31, bg: 41 },
  green:         { fg: 32, bg: 42 },
  yellow:        { fg: 33, bg: 43 },
  blue:          { fg: 34, bg: 44 },
  magenta:       { fg: 35, bg: 45 },
  cyan:          { fg: 36, bg: 46 },
  white:         { fg: 37, bg: 47 },
  "bright-black":  { fg: 90, bg: 100 },
  "bright-red":    { fg: 91, bg: 101 },
  "bright-green":  { fg: 92, bg: 102 },
  "bright-yellow": { fg: 93, bg: 103 },
  "bright-blue":   { fg: 94, bg: 104 },
  "bright-magenta": { fg: 95, bg: 105 },
  "bright-cyan":   { fg: 96, bg: 106 },
  "bright-white":  { fg: 97, bg: 107 },
};

export class Color {
  private value: ColorValue;

  constructor(value?: ColorValue) {
    this.value = value ?? "white";
  }

  static default(): Color {
    return new Color("white");
  }

  static parse(input: string): Color {
    const lower = input.toLowerCase();
    if (NAMED_COLORS[lower]) {
      return new Color(lower);
    }
    if (input.startsWith("#")) {
      if (input.length !== 7) {
        throw new Error(`expected format \`#rrggbb\`, found \`${input}\``);
      }
      const r = Number.parseInt(input.slice(1, 3), 16);
      const g = Number.parseInt(input.slice(3, 5), 16);
      const b = Number.parseInt(input.slice(5, 7), 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        throw new Error(`invalid hex color code \`${input}\``);
      }
      return new Color({ r, g, b });
    }
    throw new Error(
      `color \`${input}\` is neither a recognized color nor a valid hex color code.\n  [possible values: ${POSSIBLE_VALUES.join(", ")}]`
    );
  }

  foreground(): string {
    if (typeof this.value === "object") {
      return `\x1B[38;2;${this.value.r};${this.value.g};${this.value.b}m`;
    }
    const code = NAMED_COLORS[this.value];
    if (!code) return "";
    return `\x1B[${code.fg}m`;
  }

  background(): string {
    if (typeof this.value === "object") {
      return `\x1B[48;2;${this.value.r};${this.value.g};${this.value.b}m`;
    }
    const code = NAMED_COLORS[this.value];
    if (!code) return "";
    return `\x1B[${code.bg}m`;
  }

  toInkColor(): string {
    if (typeof this.value === "object") {
      const hex = `#${this.value.r.toString(16).padStart(2, "0")}${this.value.g.toString(16).padStart(2, "0")}${this.value.b.toString(16).padStart(2, "0")}`;
      return hex;
    }
    return this.value;
  }

  toString(): string {
    if (typeof this.value === "object") {
      return `#${this.value.r.toString(16).padStart(2, "0")}${this.value.g.toString(16).padStart(2, "0")}${this.value.b.toString(16).padStart(2, "0")}`;
    }
    return this.value;
  }
}
