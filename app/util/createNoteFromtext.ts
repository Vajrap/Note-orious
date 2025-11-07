import { Tag } from "@/app/useNote";
import { resolveRelativeDate } from "./noteValidation";

export function createNoteFromText(text: string, id?: number) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  let title = "";
  let note = trimmed;

  const colonIndex = trimmed.indexOf(":");
  if (colonIndex !== -1) {
    title = trimmed.slice(0, colonIndex).trim();
    note = trimmed.slice(colonIndex + 1).trim();
  } else {
    title = trimmed.split(" ").slice(0, 4).join(" ");
  }

  const rawTags = Array.from(
    new Set(Array.from(trimmed.matchAll(/#(\w+)/g), (m) => m[1].toLowerCase())),
  );

  const tags = rawTags
    .map((t) =>
      Object.values(Tag).includes(t as Tag) ? (t as Tag) : undefined,
    )
    .filter((t): t is Tag => t !== undefined);

  const dateMatch = trimmed.match(/@([\w/-]+)/);
  let dateTimeISO: string | undefined = undefined;

  if (dateMatch) {
    const rawDate = dateMatch[1].toLowerCase();
    const resolved = resolveRelativeDate(rawDate);
    if (resolved) {
      dateTimeISO = resolved;
    } else {
      const parsed = new Date(rawDate.replace(/-/g, "/"));
      if (!isNaN(parsed.getTime())) {
        dateTimeISO = parsed.toISOString();
      }
    }
  }

  return {
    id: id || Date.now(),
    title,
    note,
    tags,
    date: dateTimeISO,
  };
}
