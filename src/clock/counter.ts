export enum CounterType {
  Stopwatch,
  Timer,
}

export interface TimerConfig {
  duration: number;
  kill: boolean;
}

export class Counter {
  static readonly DEFAULT_TIMER_DURATION = 5 * 60;
  static readonly MAX_TIMER_DURATION = 99 * 3600 + 59 * 60 + 59;

  text: string;
  private type: CounterType;
  private timerConfig: TimerConfig | null;
  private startTime: number;
  private lastPause: number | null;
  private paused: boolean;

  private static readonly TEXT = "P: Toggle Pause, R: Restart";
  private static readonly TEXT_PAUSED = "P: Toggle Pause, R: Restart [Paused]";

  constructor(type: CounterType, timerConfig?: TimerConfig) {
    this.type = type;
    this.timerConfig = timerConfig ?? null;
    this.text = Counter.TEXT;
    this.startTime = Date.now();
    this.lastPause = null;
    this.paused = false;
  }

  togglePause(): void {
    if (this.paused) {
      if (this.lastPause !== null) {
        this.startTime += Date.now() - this.lastPause;
        this.lastPause = null;
      }
      this.text = Counter.TEXT;
    } else {
      this.lastPause = Date.now();
      this.text = Counter.TEXT_PAUSED;
    }
    this.paused = !this.paused;
  }

  restart(): void {
    this.startTime = Date.now();
    this.lastPause = null;
    if (this.paused) {
      this.togglePause();
    }
  }

  getTime(): [number, number, number] {
    const now = Date.now();
    let elapsed = this.paused
      ? (this.lastPause ?? this.startTime) - this.startTime
      : now - this.startTime;

    let secs = Math.floor(elapsed / 1000);

    if (this.type === CounterType.Timer && this.timerConfig) {
      const remaining = Math.max(0, this.timerConfig.duration - secs);
      secs = remaining;

      if (remaining === 0 && this.timerConfig.kill) {
        return [0, 0, 0];
      }
    }

    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;

    return [hours, minutes, seconds];
  }

  isFinished(): boolean {
    if (this.type !== CounterType.Timer || !this.timerConfig) return false;
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    return elapsed >= this.timerConfig.duration;
  }

  shouldKillOnFinish(): boolean {
    return this.timerConfig?.kill ?? false;
  }
}
