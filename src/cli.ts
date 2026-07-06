import { Command } from "commander";

import { Color } from "./color";
import { ZeroIntervalError } from "./error";
import { parsePosition, Position } from "./position";
import type { Config } from "./config";
import { FONT_NAMES, isValidFont } from "./clock/fontRenderer";

export interface CliOptions {
  color?: string;
  interval?: string;
  blink: boolean;
  bold: boolean;
  font?: string;
  xPos?: string;
  yPos?: string;
  fmt?: string;
  use12h: boolean;
  utc: boolean;
  hideSeconds: boolean;
  timerSeconds?: string;
  timerMinutes?: string;
  timerHours?: string;
  timerKill: boolean;
}

export function parseCli(): { opts: CliOptions; args: string[] } {
  const program = new Command()
    .name("clock-ts")
    .description("A modern, terminal-based digital clock")
    .version("v0.2.1, (c) 2024 Oughie")
    .allowExcessArguments(false)
    .helpOption("-h, --help")
    .addHelpCommand(false)
    .action(() => {});

  program
    .option("-c, --color <color>", "Specify the clock color")
    .option("-i, --interval <ms>", "Set the polling interval in milliseconds")
    .option("-B, --blink", "Set the colon to blink")
    .option("-b, --bold", "Use bold text")
    .option("-x, --x-pos <pos>", "Set the position along the horizontal axis")
    .option("-y, --y-pos <pos>", "Set the position along the vertical axis")
    .option("--fmt <fmt>", "Set the date format")
    .option("-t", "Use the 12h format")
    .option("--utc", "Use UTC time")
    .option("-s, --hide-seconds", "Do not show seconds")
    .option("--font <font>", `Set the clock font (digital, ${FONT_NAMES.join(", ")})`)
    .option("-S, --timer-seconds <s>", "Add seconds to the timer")
    .option("-M, --timer-minutes <m>", "Add minutes to the timer")
    .option("-H, --timer-hours <h>", "Add hours to the timer")
    .option("-k, --timer-kill", "Terminate the application when the timer finishes");

  program.parse();

  const opts = program.opts() as CliOptions;
  const args = program.args;

  return { opts, args };
}

export function applyCliOverrides(
  opts: CliOptions,
  config: Config,
  mode: string | undefined
): void {
  if (opts.color) {
    config.general.color = Color.parse(opts.color);
  }

  if (opts.interval !== undefined) {
    const interval = Number(opts.interval);
    if (interval === 0) {
      throw new ZeroIntervalError();
    }
    config.general.interval = interval;
  }

  if (opts.blink) {
    config.general.blink = true;
  }

  if (opts.bold) {
    config.general.bold = true;
  }

  if (opts.xPos) {
    config.position.horizontal = parsePosition(opts.xPos);
  }

  if (opts.yPos) {
    config.position.vertical = parsePosition(opts.yPos);
  }

  if (opts.fmt) {
    config.date.fmt = opts.fmt;
  }

  if (opts.use12h) {
    config.date.use12h = true;
  }

  if (opts.utc) {
    config.date.utc = true;
  }

  if (opts.hideSeconds) {
    config.date.hideSeconds = true;
  }

  if (opts.font !== undefined) {
    if (!isValidFont(opts.font)) {
      throw new Error(`unknown font \`${opts.font}\`. Valid fonts: digital, ${FONT_NAMES.join(", ")}`);
    }
    config.general.font = opts.font;
  }
}

export function extractMode(args: string[]): string | undefined {
  if (args.length === 0) return undefined;
  const first = args[0].toLowerCase();
  if (["clock", "timer", "stopwatch"].includes(first)) {
    return first;
  }
  return undefined;
}
