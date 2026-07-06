export enum TimeZoneKind {
  Local,
  Utc,
}

export function getTime(kind: TimeZoneKind): [number, number, number] {
  const now = new Date();
  if (kind === TimeZoneKind.Utc) {
    return [now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()];
  }
  return [now.getHours(), now.getMinutes(), now.getSeconds()];
}

export function formatDate(kind: TimeZoneKind, fmt: string): string {
  const now = new Date();

  const pad = (n: number, len = 2) => String(n).padStart(len, "0");

  const year = kind === TimeZoneKind.Utc ? now.getUTCFullYear() : now.getFullYear();
  const month = (kind === TimeZoneKind.Utc ? now.getUTCMonth() : now.getMonth()) + 1;
  const day = kind === TimeZoneKind.Utc ? now.getUTCDate() : now.getDate();
  const hour = kind === TimeZoneKind.Utc ? now.getUTCHours() : now.getHours();
  const minute = kind === TimeZoneKind.Utc ? now.getUTCMinutes() : now.getMinutes();
  const second = kind === TimeZoneKind.Utc ? now.getUTCSeconds() : now.getSeconds();

  const dayOfWeek = kind === TimeZoneKind.Utc ? now.getUTCDay() : now.getDay();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  let result = "";
  for (let i = 0; i < fmt.length; i++) {
    if (fmt[i] === "%") {
      i++;
      if (i >= fmt.length) {
        result += "%";
        break;
      }
      switch (fmt[i]) {
        case "Y": result += String(year).padStart(4, "0"); break;
        case "y": result += String(year).slice(-2); break;
        case "m": result += pad(month); break;
        case "d": result += pad(day); break;
        case "H": result += pad(hour); break;
        case "I": result += pad(hour % 12 || 12); break;
        case "M": result += pad(minute); break;
        case "S": result += pad(second); break;
        case "p": result += hour < 12 ? "AM" : "PM"; break;
        case "P": result += hour < 12 ? "am" : "pm"; break;
        case "A": result += dayNames[dayOfWeek]; break;
        case "a": result += dayNames[dayOfWeek].slice(0, 3); break;
        case "B": result += monNames[month - 1]; break;
        case "b": result += monNames[month - 1].slice(0, 3); break;
        case "j": result += pad(Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86400000)); break;
        case "U": result += pad(Math.ceil(((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86400000 + dayOfWeek) / 7)); break;
        case "W": result += pad(Math.ceil(((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86400000 + (dayOfWeek || 7) - 1) / 7)); break;
        case "V": result += pad(Math.ceil(((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 4)) / 86400000 + (dayOfWeek || 7) - 3) / 7 + 1)); break;
        case "w": result += String(dayOfWeek); break;
        case "%": result += "%"; break;
        case "C": result += String(Math.floor(year / 100)); break;
        case "D": result += `${pad(month)}/${pad(day)}/${String(year).slice(-2)}`; break;
        case "F": result += `${year}-${pad(month)}-${pad(day)}`; break;
        case "T": result += `${pad(hour)}:${pad(minute)}:${pad(second)}`; break;
        case "R": result += `${pad(hour)}:${pad(minute)}`; break;
        default: result += `%${fmt[i]}`; break;
      }
    } else {
      result += fmt[i];
    }
  }

  return result;
}
