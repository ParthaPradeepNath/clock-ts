# clock-ts

A modern, digital clock that runs in your terminal. Ported from [clock-rs](https://github.com/Oughie/clock-rs).

Built with [TypeScript](https://www.typescriptlang.org/), [Bun](https://bun.sh/), and [Ink](https://github.com/vadimdemedes/ink) (React-based terminal UI).

## Features

- Digital 7-segment clock display
- Timer and stopwatch modes
- JSON configuration file with CLI overrides
- Configurable colors, position, date format, and more
- Keyboard controls (Pause, Restart, Reload config)
- Cross-platform (macOS, Linux, Windows)

## Installation

### Using Bun

```bash
# Install globally
bun install -g clock-ts

# Or run directly
bunx clock-ts
```

### Building from source

```bash
git clone https://github.com/Oughie/clock-ts
cd clock-ts
bun install
bun run src/index.tsx
```

## Usage

```
clock-ts [options] [command]

Commands:
  clock       Display the current time (default)
  timer       Create a timer (5 minutes if no time is specified)
  stopwatch   Start a stopwatch

Options:
  -c, --color <color>        Specify the clock color
  -i, --interval <ms>        Set the polling interval in milliseconds
  -B, --blink                Set the colon to blink
  -b, --bold                 Use bold text
  -x, --x-pos <pos>          Set the position along the horizontal axis
  -y, --y-pos <pos>          Set the position along the vertical axis
      --fmt <fmt>            Set the date format
  -t                         Use the 12h format
      --utc                  Use UTC time
  -s, --hide-seconds         Do not show seconds
  -h, --help                 Print help
  -V, --version              Print version

Timer options:
  -S, --seconds <s>          Add seconds to the timer
  -M, --minutes <m>          Add minutes to the timer
  -H, --hours <h>            Add hours to the timer
  -k, --kill                 Terminate when the timer finishes
```

### Controls

| Key              | Action                |
|------------------|-----------------------|
| `Esc`, `q`, `Q`  | Quit                  |
| `Ctrl + C`       | Quit                  |
| `Ctrl + R`       | Reload configuration  |
| `P`, `p`         | Toggle pause (timer/stopwatch) |
| `R`, `r`         | Restart (timer/stopwatch) |

## Configuration

`clock-ts` uses JSON format for its settings. By default, the configuration file is named `conf.json` and stored in the OS configuration directory:

| Platform | Configuration file path |
|----------|------------------------|
| macOS    | `~/Library/Application Support/clock-ts/conf.json` |
| Linux    | `~/.config/clock-ts/conf.json` |
| Windows  | `C:\Users\%USERNAME%\AppData\Local\clock-ts\conf.json` |

Override the path by setting the `CONF_PATH` environment variable. Set it to `None` to run without a config file.

### Fields

| Field | Description | Possible values | Default |
|-------|-------------|----------------|---------|
| `general.color` | Clock color | `"black"`, `"red"`, `"green"`, `"yellow"`, `"blue"`, `"magenta"`, `"cyan"`, `"white"`, `"bright-*"`, or `"#rrggbb"` | `"white"` |
| `general.interval` | Polling interval in ms | Positive integer | `200` |
| `general.blink` | Blinking colon | `true` / `false` | `false` |
| `general.bold` | Bold text | `true` / `false` | `false` |
| `position.horizontal` | Horizontal position | `"start"`, `"center"`, `"end"` | `"center"` |
| `position.vertical` | Vertical position | `"start"`, `"center"`, `"end"` | `"center"` |
| `date.fmt` | Date format string | Any strftime-like format | `"%d-%m-%Y"` |
| `date.use12h` | 12-hour format | `true` / `false` | `false` |
| `date.utc` | Use UTC time | `true` / `false` | `false` |
| `date.hideSeconds` | Hide seconds | `true` / `false` | `false` |

### Example `conf.json`

```json
{
  "general": {
    "color": "magenta",
    "interval": 250,
    "blink": true,
    "bold": true
  },
  "position": {
    "horizontal": "center",
    "vertical": "center"
  },
  "date": {
    "fmt": "%A, %B %d, %Y",
    "use12h": true,
    "utc": true,
    "hideSeconds": true
  }
}
```

## Project Structure

```
clock-ts/
├── src/
│   ├── index.tsx          # Entry point
│   ├── cli.ts             # CLI argument parsing
│   ├── config.ts          # JSON config handling
│   ├── error.ts           # Error types
│   ├── color.ts           # Color utilities
│   ├── position.ts        # Position calculation
│   ├── segment.ts         # 7-segment display patterns
│   ├── character.ts       # Character to segment mapping
│   └── clock/
│       ├── App.tsx         # Main Ink app component
│       ├── ClockDisplay.tsx # Clock rendering component
│       ├── counter.ts      # Timer/Stopwatch logic
│       ├── mode.ts         # Clock mode types
│       └── timeZone.ts     # Time zone handling
├── public/
│   └── default.json       # Default configuration
├── package.json
├── tsconfig.json
└── README.md
```

## License

Copyright © 2026 deepNath

Licensed under the Apache License 2.0.
