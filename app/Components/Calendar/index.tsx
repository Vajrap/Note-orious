"use client";
import React, { useCallback, useMemo } from "react";
import { useNote } from "@/app/useNote";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Badge } from "@mui/material";

export const Calendar = () => {
  const { currentDate, setCurrentDate, notes } = useNote();
  const dateWithNotes = useCallback(() => {
    return new Set(
      notes
        .filter((note) => !!note.date)
        .map((note) => dayjs(note.date).format("YYYY-MM-DD")),
    );
  }, [notes]);

  const noteCount = useMemo(() => {
    const map: Record<string, number> = {};
    notes.forEach((note) => {
      if (note.date) {
        const date = dayjs(note.date).format("YYYY-MM-DD");
        map[date] = (map[date] ?? 0) + 1;
      }
    });
    return map;
  }, [notes]);

  const DayBadge = useCallback(
    (props: PickersDayProps) => {
      const { day, outsideCurrentMonth, ...other } = props;
      const iso = day.format("YYYY-MM-DD");
      const hasNotes = dateWithNotes().has(iso);

      return (
        <Badge
          overlap="circular"
          badgeContent={hasNotes ? noteCount[iso] : undefined}
          color="primary"
          invisible={!hasNotes}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "orange",
              borderRadius: "50%",
              boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <PickersDay
            day={day}
            outsideCurrentMonth={outsideCurrentMonth}
            {...other}
          />
        </Badge>
      );
    },
    [dateWithNotes, noteCount],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        sx={{ height: "30vh" }}
        value={currentDate}
        onChange={(newDate) => {
          // TODO: Handle clicked = filter + change current Date
          const clicked = newDate ?? dayjs();
          setCurrentDate(clicked);
        }}
        slots={{ day: DayBadge }}
      />
    </LocalizationProvider>
  );
};
