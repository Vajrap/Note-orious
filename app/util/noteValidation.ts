import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { Tag } from "@/app/useNote";

dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);

export const relativeKeywords = [
  "today",
  "tomorrow",
  "yesterday",
  "nextmonday",
  "nexttuesday",
  "nextwednesday",
  "nextthursday",
  "nextfriday",
  "nextsaturday",
  "nextsunday",
  "nextweek",
  "nextmonth",
];

const availableTags = Object.values(Tag);

export const validateTags = (text: string): string | null => {
  const rawTags = Array.from(text.matchAll(/#(\w+)/g), (m) => m[1]);
  for (const raw of rawTags) {
    if (!availableTags.includes(raw as Tag)) {
      return `Invalid tag: #${raw}. Allowed: ${availableTags
        .map((tag) => `#${tag}`)
        .join(", ")}`;
    }
  }
  return null;
};

export const validateDate = (text: string): string | null => {
  const matches = Array.from(text.matchAll(/@([\w/-]+)/g));

  if (matches.length > 1) {
    return "You can only have one @date per note.";
  }

  if (matches.length === 1) {
    const raw = matches[0][1]?.trim().toLowerCase();

    if (relativeKeywords.includes(raw)) return null;

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (datePattern.test(raw)) {
      const parsed = new Date(raw);
      if (!isNaN(parsed.getTime())) return null;
      return `Invalid date: @${raw} is not a real date.`;
    }

    return `Invalid date keyword: @${raw}. Allowed: @YYYY-MM-DD or ${relativeKeywords
      .map((k) => `@${k}`)
      .join(", ")}`;
  }

  return null;
};

export const validateNote = (text: string): string | null => {
  const tagError = validateTags(text);
  const dateError = validateDate(text);
  return [tagError, dateError].filter(Boolean).join("\n") || null;
};

export const resolveRelativeDate = (key: string): string | undefined => {
  const now = dayjs();

  switch (key) {
    case "today":
      return now.toISOString();
    case "tomorrow":
      return now.add(1, "day").toISOString();
    case "yesterday":
      return now.subtract(1, "day").toISOString();
    case "nextweek":
      return now.add(1, "week").toISOString();
    case "nextmonth":
      return now.add(1, "month").toISOString();
    default:
      if (key.startsWith("next")) {
        const dayName = key.slice(4);
        const weekdayIndex = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ].indexOf(dayName);
        if (weekdayIndex !== -1) {
          const nextDay = now.add(1, "week").weekday(weekdayIndex);
          return nextDay.toISOString();
        }
      }
  }
};
