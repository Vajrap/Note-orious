import { useNote } from "@/app/useNote";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import style from "./style.module.scss";
import { validateNote } from "@/app/util/noteValidation";
import { createNoteFromText } from "@/app/util/createNoteFromtext";

dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);

const STORAGE_NAME = "note-orious-draft";

export const NoteSection = () => {
  const { setNotes } = useNote();
  const [noteText, setNoteText] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(STORAGE_NAME);
      if (saved) {
        queueMicrotask(() => setNoteText(saved));
      }
    } catch (err) {
      console.warn("Failed to load draft:", err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = setTimeout(() => {
      try {
        const trimmed = noteText.trim();
        if (trimmed) {
          window.localStorage.setItem("noteDraft", noteText);
        } else {
          window.localStorage.removeItem("noteDraft");
        }
      } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [noteText]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNoteText(value);
    setErrorText(validateNote(value));
  };

  const handleSaveNote = () => {
    const toSave = createNoteFromText(noteText);
    if (!toSave) return;

    setNotes((prev) => [...prev, toSave]);
    setNoteText("");
  };

  return (
    <div className={style.noteSectionWrapper}>
      <TextField
        label="Let's take a Note"
        multiline
        minRows={6}
        fullWidth
        value={noteText}
        onChange={handleChange}
        placeholder="What's on your mind?"
        error={!!errorText}
        helperText={
          errorText ??
          "Use #tags or @date (In YYYY-MM-DD)! to Automatically add them!"
        }
        slotProps={{
          formHelperText: { sx: { whiteSpace: "pre-line" } },
          htmlInput: {
            spellCheck: false,
            "data-gramm": "false",
            "data-gramm_editor": "false",
            autoCorrect: "off",
            autoCapitalize: "off",
          },
        }}
      />

      <Button
        variant="contained"
        onClick={handleSaveNote}
        disabled={!noteText.trim()}
        size="large"
        fullWidth
      >
        Save
      </Button>
    </div>
  );
};
