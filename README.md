# clock-ts

A modern, digital clock that runs in your terminal.

![HeadShot](public/headshot.png)

Built with [TypeScript](https://www.typescriptlang.org/), [Bun](https://bun.sh/), and [Ink](https://github.com/vadimdemedes/ink) (React-based terminal UI).

## Features

- 11 font styles: `digital` (7-segment), `standard`, `big`, `doom`, `slant`, `block`, `banner`, `small`, `lean`, `shadow`, `rectangles`
- Timer and stopwatch modes
- JSON configuration file with CLI overrides
- Configurable colors, position, date format, font, and more
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
git clone https://github.com/ParthaPradeepNath/clock-ts
cd clock-ts
bun install
bun run src/index.tsx
```

## Dev commands

| Command | Description |
|---|---|
| `bun run dev` | Run with file watching |
| `bun run src/index.tsx` | Run once |
| `bun run dist/index.js` | Run compiled bundle |
| `bun run src/index.tsx --help` | Show help |
| `bun run src/index.tsx --version` | Show version |

## Modes

| Command | Mode |
|---|---|
| `bun run src/index.tsx clock` | Clock (default) |
| `bun run src/index.tsx stopwatch` | Stopwatch |
| `bun run src/index.tsx timer` | Timer (5 min default) |

## CLI options

### Display

| Flag | Example | Effect |
|---|---|---|
| `-c, --color <color>` | `--color green` | Clock color (named or `#rrggbb`) |
| `-i, --interval <ms>` | `-i 100` | Polling interval in milliseconds (default `200`) |
| `-B, --blink` | `-B` | Blinking colon |
| `-b, --bold` | `-b` | Bold text |

### Position

| Flag | Values | Example |
|---|---|---|
| `-x, --x-pos <pos>` | `start`, `center`, `end` | `-x start` |
| `-y, --y-pos <pos>` | `start`, `center`, `end` | `-y end` |

### Date/Time

| Flag | Example | Effect |
|---|---|---|
| `--fmt <fmt>` | `--fmt "%A, %d %B %Y"` | strftime date format (default `%d-%m-%Y`) |
| `-t` | `-t` | 12-hour format |
| `--utc` | `--utc` | Use UTC time |
| `-s, --hide-seconds` | `-s` | Hide seconds |

### Font

| Flag | Example | Effect |
|---|---|---|
| `--font <font>` | `--font big` | Font style (`digital`, `standard`, `big`, `doom`, `slant`, `block`, `banner`, `small`, `lean`, `shadow`, `rectangles`) |

### Timer

| Flag | Example | Effect |
|---|---|---|
| `-S, --timer-seconds <s>` | `timer -S 30` | Set timer seconds |
| `-M, --timer-minutes <m>` | `timer -M 5` | Set timer minutes |
| `-H, --timer-hours <h>` | `timer -H 1` | Set timer hours |
| `-k, --timer-kill` | `timer -M 5 -k` | Exit app when timer finishes |

Timer duration defaults to 5 minutes if no time flags are given. Maximum is 99h 59m 59s.

```bash
bun run src/index.tsx timer -S 30                      # 30 seconds
bun run src/index.tsx timer -M 5 -S 30                 # 5m 30s
bun run src/index.tsx timer -H 1 -M 30 -S 15           # 1h 30m 15s
bun run src/index.tsx timer -M 5 -k                    # 5 min, exit when done
```

### Color values

Named colors: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `bright-black`, `bright-red`, `bright-green`, `bright-yellow`, `bright-blue`, `bright-magenta`, `bright-cyan`, `bright-white`.

Hex colors: `#rrggbb` (e.g. `#ff5500`).

### Combinations

```bash
bun run src/index.tsx --font big -c green -b -B --utc -t -x center -y center
bun run src/index.tsx --font doom -c "#ff0000" --fmt "%H:%M" -s
bun run src/index.tsx stopwatch -i 50 -c bright-yellow -b
```

## Keyboard shortcuts

| Key | Action |
|---|---|
| `q`, `Q`, `Esc` | Quit |
| `Ctrl+C` | Quit |
| `Ctrl+R` | Reload configuration |
| `p`, `P` | Pause / resume (timer / stopwatch) |
| `r`, `R` | Restart (timer / stopwatch) |

## Configuration

`clock-ts` uses JSON format for its settings. By default, the configuration file is named `conf.json` and stored in the OS configuration directory:

| Platform | Configuration file path |
|---|---|
| macOS | `~/Library/Application Support/clock-ts/conf.json` |
| Linux | `~/.config/clock-ts/conf.json` or `$XDG_CONFIG_HOME/clock-ts/conf.json` |
| Windows | `%APPDATA%\clock-ts\conf.json` |

Override the path by setting the `CONF_PATH` environment variable. Set it to `None` to run without a config file.

### Fields

| Field | Description | Possible values | Default |
|---|---|---|---|
| `general.color` | Clock color | Named color or `"#rrggbb"` | `"white"` |
| `general.interval` | Polling interval in ms | Positive integer | `200` |
| `general.blink` | Blinking colon | `true` / `false` | `false` |
| `general.bold` | Bold text | `true` / `false` | `false` |
| `general.font` | Clock font style | `"digital"`, `"standard"`, `"big"`, `"doom"`, `"slant"`, `"block"`, `"banner"`, `"small"`, `"lean"`, `"shadow"`, `"rectangles"` | `"digital"` |
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
    "color": "green",
    "interval": 200,
    "blink": true,
    "bold": true,
    "font": "big"
  },
  "position": {
    "horizontal": "center",
    "vertical": "center"
  },
  "date": {
    "fmt": "%d-%m-%Y",
    "use12h": true,
    "utc": false,
    "hideSeconds": false
  }
}
```

## License

Copyright © 2026 deepNath

Licensed under the Apache License 2.0.
