import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Text, useInput, useApp, useWindowSize } from "ink";

import { calculatePosition } from "../position";
import { Config, parseConfig } from "../config";
import { CounterType } from "./counter";
import { ClockMode, getClockTime, getClockText } from "./mode";
import { TimeZoneKind } from "./timeZone";
import { ClockDisplay, isClockTooLarge, calculatePadding } from "./ClockDisplay";

interface AppProps {
  initialConfig: Config;
  initialMode: ClockMode;
}

export function App({ initialConfig, initialMode }: AppProps) {
  const { exit } = useApp();
  const { columns, rows } = useWindowSize();

  const configRef = useRef<Config>(initialConfig);
  const modeRef = useRef<ClockMode>(initialMode);
  const [time, setTime] = useState<[number, number, number]>([0, 0, 0]);
  const [subtitle, setSubtitle] = useState("");
  const [padding, setPadding] = useState({ top: 0, left: 0 });
  const [clockFit, setClockFit] = useState(true);

  const updateDisplay = useCallback(() => {
    const cfg = configRef.current;
    const mode = modeRef.current;
    const cw = cfg.date.hideSeconds ? 32 : 51;

    if (mode.type === "counter" && mode.counter.isFinished() && mode.counter.shouldKillOnFinish()) {
      exit();
      process.exit(0);
      return;
    }

    const [h, m, s] = getClockTime(mode);
    setTime([h, m, s]);

    const text = getClockText(mode, cw);
    const totalTextLen = text.length + (cfg.date.use12h ? 5 : 0);
    setSubtitle(text);

    const pt = calculatePadding(
      columns,
      rows,
      cfg.date.hideSeconds,
      (total, offset) => calculatePosition(cfg.position.horizontal, total, offset),
      (total, offset) => calculatePosition(cfg.position.vertical, total, offset),
      totalTextLen
    );
    setPadding(pt);
  }, [columns, rows, exit]);

  const cfg = configRef.current;

  useEffect(() => {
    updateDisplay();

    const intervalMs = cfg.general.interval;
    const interval = setInterval(updateDisplay, intervalMs);
    return () => clearInterval(interval);
  }, [updateDisplay, cfg.general.interval]);

  useEffect(() => {
    const fit = !isClockTooLarge(columns, rows, configRef.current.date.hideSeconds);
    setClockFit(fit);
    if (fit) {
      updateDisplay();
    }
  }, [columns, rows, updateDisplay]);

  const reloadConfig = useCallback(async () => {
    try {
      const newConfig = await parseConfig();
      configRef.current = newConfig;

      const mode = modeRef.current;
      if (mode.type === "time") {
        modeRef.current = {
          type: "time",
          timeZone: newConfig.date.utc ? TimeZoneKind.Utc : TimeZoneKind.Local,
          dateFormat: newConfig.date.fmt,
        };
      }

      updateDisplay();
    } catch {
      // silently ignore config reload errors
    }
  }, [updateDisplay]);

  useInput((input, key) => {
    if (
      key.escape ||
      input === "q" ||
      input === "Q" ||
      (key.ctrl && input === "c")
    ) {
      exit();
      return;
    }

    if (key.ctrl && input === "r") {
      reloadConfig();
      return;
    }

    if (input === "p" || input === "P") {
      const mode = modeRef.current;
      if (mode.type === "counter") {
        mode.counter.togglePause();
        setSubtitle(mode.counter.text);
        updateDisplay();
      }
      return;
    }

    if (input === "r" || input === "R") {
      const mode = modeRef.current;
      if (mode.type === "counter") {
        mode.counter.restart();
        setSubtitle(mode.counter.text);
        updateDisplay();
      }
      return;
    }
  });

  const [h, m, s] = time;

  if (!clockFit) {
    return (
      <Box width={columns} height={rows} alignItems="center" justifyContent="center">
        <Text color="red">Terminal window too small</Text>
      </Box>
    );
  }

  return (
    <Box width={columns} height={rows}>
      <ClockDisplay
        hour={h}
        minute={m}
        second={s}
        color={cfg.general.color}
        blink={cfg.general.blink}
        bold={cfg.general.bold}
        use12h={cfg.date.use12h}
        hideSeconds={cfg.date.hideSeconds}
        subtitle={subtitle}
        paddingTop={padding.top}
        paddingLeft={padding.left}
      />
    </Box>
  );
}
