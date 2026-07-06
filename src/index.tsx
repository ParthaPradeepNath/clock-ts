#!/usr/bin/env bun

import { render } from "ink";

import { parseCli, applyCliOverrides, extractMode, CliOptions } from "./cli";
import { parseConfig, Config } from "./config";
import { TimerDurationTooLongError, ZeroIntervalError, ClockError } from "./error";
import { Counter, CounterType } from "./clock/counter";
import { ClockMode } from "./clock/mode";
import { TimeZoneKind } from "./clock/timeZone";
import { App } from "./clock/App";

async function main() {
  const { opts, args } = parseCli();
  const modeStr = extractMode(args);

  let config: Config;
  try {
    config = await parseConfig();
  } catch (err) {
    console.error(`error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  try {
    applyCliOverrides(opts, config, modeStr);
  } catch (err) {
    if (err instanceof ZeroIntervalError) {
      console.error(`error: ${err.message}`);
      process.exit(1);
    }
    console.error(`error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  const mode = resolveMode(opts, modeStr, config);
  if (mode instanceof Error) {
    console.error(`error: ${mode.message}`);
    process.exit(1);
  }

  const { waitUntilExit } = render(<App initialConfig={config} initialMode={mode} />);
  await waitUntilExit();
}

function resolveMode(
  opts: CliOptions,
  modeStr: string | undefined,
  config: Config
): ClockMode | Error {
  if (modeStr === undefined || modeStr === "clock") {
    return {
      type: "time",
      timeZone: config.date.utc ? TimeZoneKind.Utc : TimeZoneKind.Local,
      dateFormat: config.date.fmt,
    };
  }

  if (modeStr === "stopwatch") {
    return {
      type: "counter",
      counter: new Counter(CounterType.Stopwatch),
    };
  }

  if (modeStr === "timer") {
    const seconds = opts.timerSeconds ? Number(opts.timerSeconds) : undefined;
    const minutes = opts.timerMinutes ? Number(opts.timerMinutes) : undefined;
    const hours = opts.timerHours ? Number(opts.timerHours) : undefined;
    const kill = opts.timerKill ?? false;

    let totalSeconds: number;
    if (seconds === undefined && minutes === undefined && hours === undefined) {
      totalSeconds = Counter.DEFAULT_TIMER_DURATION;
    } else {
      const s = seconds ?? 0;
      const m = minutes ?? 0;
      const h = hours ?? 0;
      totalSeconds = h * 3600 + m * 60 + s;

      if (totalSeconds > Counter.MAX_TIMER_DURATION) {
        return new TimerDurationTooLongError(h, m, s);
      }
    }

    return {
      type: "counter",
      counter: new Counter(CounterType.Timer, { duration: totalSeconds, kill }),
    };
  }

  return new ClockError(`unknown command: ${modeStr}`);
}

main().catch((err) => {
  const msg = err instanceof ClockError ? err.message : String(err);
  console.error(`\x1B[1;31merror:\x1B[0m ${msg}`);
  process.exit(1);
});
