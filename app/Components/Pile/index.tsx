"use client";
import React, { useState } from "react";
import { Note, useNote } from "@/app/useNote";
import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { NoteModal } from "../NoteModal";
import { SearchAndFilterSection } from "./SearchAndFilterSection";

export const Pile = () => {
  const { filteredNotes } = useNote();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <Stack direction="row">
      <Stack direction="column">
        <Typography variant="h6">Stinky Smart Pile of Notes</Typography>
        {/* Filtering UI */}
        <Paper
          variant="outlined"
          sx={{
            marginRight: 20,
            width: "30vw",
            height: "30vh",
            overflow: "auto",
          }}
        >
          {filteredNotes.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nothing here yet — The room is oddly clean.
            </Typography>
          ) : (
            <List dense disablePadding>
              {filteredNotes.map((note) => (
                <ListItemButton
                  key={note.id}
                  sx={{ py: 0.2, px: 1 }}
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
          )}
        </Paper>

        {selectedNote && (
          <NoteModal
            open={!!selectedNote}
            note={selectedNote}
            onCloseAction={() => setSelectedNote(null)}
          />
        )}
      </Stack>
      <SearchAndFilterSection />
    </Stack>
  );
};
