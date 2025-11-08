"use client";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import styles from "./style.module.scss";
import { useState, useEffect } from "react";
import { validateNote } from "@/app/util/noteValidation";
import { Note, useNote } from "@/app/useNote";
import { createNoteFromText } from "@/app/util/createNoteFromtext";

type NoteModalProps = {
  open: boolean;
  note: Note | null;
  onCloseAction: () => void;
};

export const NoteModal = ({
  open,
  note,
  onCloseAction: onClose,
}: NoteModalProps) => {
  const { setNotes } = useNote();
  const [noteText, setNoteText] = useState(note?.note ?? "");
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (note) queueMicrotask(() => setNoteText(note.note ?? ""));
  }, [note]);

  const dateText = note?.date
    ? dayjs(note.date).isValid()
      ? dayjs(note.date).format("YYYY-MM-DD")
      : note.date
    : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNoteText(val);
    setErrorText(validateNote(val));
  };

  const handleSave = () => {
    if (!note) return;

    const toSave = createNoteFromText(noteText, note.id);
    if (!toSave) return;

    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, ...toSave } : n)),
    );

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className={styles.modalContainer}
        sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
      >
        <div className={styles.header}>
          <Typography variant="h6" noWrap>
            {note?.title ?? "Note"}
          </Typography>
          <IconButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </div>

        <Divider />

        <div className={styles.body}>
          <Typography variant="subtitle2" color="text.secondary">
            {dateText ? `📅 ${dateText}` : "No date assigned"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {note?.tags?.length ? `🏷️ ${note.tags.join(", ")}` : "No tags"}
          </Typography>

          <TextField
            value={noteText}
            onChange={handleChange}
            multiline
            fullWidth
            minRows={6}
            label="Your Note"
            error={!!errorText}
            helperText={
              errorText ?? "Use #tags or @date (YYYY-MM-DD) — same rules apply."
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
            onClick={handleSave}
            disabled={!noteText.trim() || !!errorText}
            size="large"
            fullWidth
          >
            Save Changes
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
