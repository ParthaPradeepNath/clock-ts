export class ClockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClockError";
  }
}

export class TimerDurationTooLongError extends ClockError {
  constructor(hours: number, minutes: number, seconds: number) {
    super(
      `the timer duration is too long: ${hours}h, ${minutes}m and ${seconds}s exceed the maximum duration of 99h, 59m and 59s`
    );
  }
}

export class DateFormatTooWideError extends ClockError {
  constructor(fmtLen: number, maxLen: number) {
    super(`the formatted date exceeds the clock's width: ${fmtLen} > ${maxLen}`);
  }
}

export class DateFormatInvalidError extends ClockError {
  constructor(fmt: string, err: string) {
    super(`failed to format the date string \`${fmt}\`: ${err}`);
  }
}

export class ReadFileError extends ClockError {
  constructor(path: string, err: string) {
    super(`failed to read file \`${path}\`: ${err}`);
  }
}

export class ParseConfigError extends ClockError {
  constructor(path: string, err: string) {
    super(`failed to parse configuration file \`${path}\`:\n${err}`);
  }
}

export class ZeroIntervalError extends ClockError {
  constructor() {
    super("interval must be greater than 0");
  }
}
