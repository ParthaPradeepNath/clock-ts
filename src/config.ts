import { Color } from "./color";
import { ParseConfigError, ReadFileError } from "./error";
import { Position } from "./position";
import { isValidFont } from "./clock/fontRenderer";

export interface GeneralConfig {
  color: Color;
  interval: number;
  blink: boolean;
  bold: boolean;
  font: string;
}

export interface PositionConfig {
  horizontal: Position;
  vertical: Position;
}

export interface DateConfig {
  fmt: string;
  use12h: boolean;
  utc: boolean;
  hideSeconds: boolean;
}

export interface Config {
  general: GeneralConfig;
  position: PositionConfig;
  date: DateConfig;
}

function defaultConfig(): Config {
  return {
    general: {
      color: Color.default(),
      interval: 200,
      blink: false,
      bold: false,
      font: "digital",
    },
    position: {
      horizontal: Position.Center,
      vertical: Position.Center,
    },
    date: {
      fmt: "%d-%m-%Y",
      use12h: false,
      utc: false,
      hideSeconds: false,
    },
  };
}

interface RawConfig {
  general?: {
    color?: string;
    interval?: number;
    blink?: boolean;
    bold?: boolean;
    font?: string;
  };
  position?: {
    horizontal?: string;
    vertical?: string;
  };
  date?: {
    fmt?: string;
    use12h?: boolean;
    utc?: boolean;
    hideSeconds?: boolean;
  };
}

function parseRaw(raw: RawConfig): Config {
  const cfg = defaultConfig();

  if (raw.general) {
    if (raw.general.color !== undefined) {
      cfg.general.color = Color.parse(raw.general.color);
    }
    if (raw.general.interval !== undefined) {
      cfg.general.interval = raw.general.interval;
    }
    if (raw.general.blink !== undefined) {
      cfg.general.blink = raw.general.blink;
    }
    if (raw.general.bold !== undefined) {
      cfg.general.bold = raw.general.bold;
    }
    if (raw.general.font !== undefined) {
      if (isValidFont(raw.general.font)) {
        cfg.general.font = raw.general.font;
      }
    }
  }

  if (raw.position) {
    if (raw.position.horizontal !== undefined) {
      cfg.position.horizontal = parsePositionEnum(raw.position.horizontal);
    }
    if (raw.position.vertical !== undefined) {
      cfg.position.vertical = parsePositionEnum(raw.position.vertical);
    }
  }

  if (raw.date) {
    if (raw.date.fmt !== undefined) {
      cfg.date.fmt = raw.date.fmt;
    }
    if (raw.date.use12h !== undefined) {
      cfg.date.use12h = raw.date.use12h;
    }
    if (raw.date.utc !== undefined) {
      cfg.date.utc = raw.date.utc;
    }
    if (raw.date.hideSeconds !== undefined) {
      cfg.date.hideSeconds = raw.date.hideSeconds;
    }
  }

  return cfg;
}

function parsePositionEnum(s: string): Position {
  const lower = s.toLowerCase();
  if (lower === "start") return Position.Start;
  if (lower === "center") return Position.Center;
  if (lower === "end") return Position.End;
  throw new Error(`invalid position \`${s}\`, expected start, center, or end`);
}

function defaultConfigPath(): string | null {
  const home = process.env.HOME || process.env.USERPROFILE;
  if (!home) return null;

  const platform = process.platform;
  if (platform === "darwin") {
    return `${home}/Library/Application Support/clock-ts/conf.json`;
  }
  if (platform === "win32") {
    const appData = process.env.APPDATA;
    return appData ? `${appData}\\clock-ts\\conf.json` : null;
  }
  const xdg = process.env.XDG_CONFIG_HOME;
  if (xdg) return `${xdg}/clock-ts/conf.json`;
  return `${home}/.config/clock-ts/conf.json`;
}

export async function parseConfig(): Promise<Config> {
  const confPath = process.env.CONF_PATH;

  let filePath: string | null = null;

  if (confPath !== undefined) {
    if (confPath === "None") {
      return defaultConfig();
    }
    filePath = confPath;
  } else {
    filePath = defaultConfigPath();
  }

  if (!filePath) {
    return defaultConfig();
  }

  let content: string;
  try {
    content = await Bun.file(filePath).text();
  } catch {
    return defaultConfig();
  }

  if (!content) {
    return defaultConfig();
  }

  try {
    const raw = JSON.parse(content) as RawConfig;
    return parseRaw(raw);
  } catch (err) {
    throw new ParseConfigError(filePath, String(err));
  }
}
