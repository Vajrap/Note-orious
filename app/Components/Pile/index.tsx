"use client";
import React, { useState } from "react";
import { FilterMode, Note, SortOrder, Tag, useNote } from "@/app/useNote";
import {
  Button,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { NoteModal } from "../NoteModal";

export const Pile = () => {
  const {
    filteredNotes,
    filterMode,
    setFilterMode,
    showPast,
    setShowPast,
    sortOrder,
    setSortOrder,
    filterTag,
    setFilterTag,
  } = useNote();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <div>
      <Typography variant="h6">Stinky Smart Pile of Notes</Typography>
      {/* Filtering UI */}
      <ToggleButtonGroup
        value={filterMode}
        exclusive
        onChange={(_, value) => value && setFilterMode(value)}
      >
        <ToggleButton value={FilterMode.All}>All</ToggleButton>
        <ToggleButton value={FilterMode.Dated}>Dated</ToggleButton>
        <ToggleButton value={FilterMode.NoDate}>No Date</ToggleButton>
      </ToggleButtonGroup>

      <FormControl size="small" sx={{ mt: 1, mb: 2, minWidth: 180 }}>
        <InputLabel id="tag-filter-label">Filter by Tag</InputLabel>
        <Select
          labelId="tag-filter-label"
          value={filterTag ?? "none"}
          label="Filter by Tag"
          onChange={(e) =>
            setFilterTag(e.target.value === "none" ? null : e.target.value)
          }
        >
          <MenuItem value="none">All Tags</MenuItem>
          {Object.values(Tag).map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button onClick={() => setShowPast((p) => !p)}>
        {showPast ? "Hide Past" : "Show Past"}
      </Button>

      {/* Sorting */}
      <Button
        onClick={() =>
          setSortOrder((prev) =>
            prev === SortOrder.asc ? SortOrder.desc : SortOrder.asc,
          )
        }
      >
        Sort: {sortOrder === SortOrder.asc ? "↑" : "↓"}
      </Button>
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
    </div>
  );
};
