"use client";
import { Note, useNote } from "@/app/useNote";
import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { NoteModal } from "../NoteModal";

export const Pile = () => {
  const { notes } = useNote();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const filteredNotes = useMemo(() => {
    // TODO: Add filtering, might need to be from the provider
    return notes;
  }, [notes]);

  return (
    <div>
      <Typography variant="h6">A Pile of Notes</Typography>
      {filteredNotes.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Nothing here yet — The room is oddly clean.
        </Typography>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            marginRight: 20,
            width: "30vw",
            height: "30vh",
            overflow: "auto",
          }}
        >
          <List dense disablePadding>
            {filteredNotes.map((note) => (
              <ListItemButton
                key={note.id}
                onClick={() => {
                  setSelectedNote(note);
                }}
              >
                <ListItemText
                  primary={note.title}
                  secondary={
                    note.date
                      ? `📅 ${dayjs(note.date).format("YYYY-MM-DD")} | ${
                          note.tags.join(", ") || ""
                        }`
                      : note.tags.join(", ") || ""
                  }
                ></ListItemText>
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
      {selectedNote && (
        <NoteModal
          open={!!selectedNote}
          note={selectedNote}
          onCloseAction={() => setSelectedNote(null)}
        />
      )}
    </div>
  );
};
