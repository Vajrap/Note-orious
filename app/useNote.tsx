import React, { createContext, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export enum Tag {
  Work = "Work",
  Study = "Study",
}

export type Note = {
  id: number;
  title: string;
  note: string;
  tags: Tag[];
  date?: string;
};

const initialNotes: Note[] = [
  {
    id: 1,
    title: "ID:1",
    note: "Lorem",
    tags: [],
    date: dayjs().add(1, "day").format("YYYY-MM-DD"),
  },
  {
    id: 2,
    title: "ID:2",
    note: "Ipsum",
    tags: [Tag.Study],
  },
  {
    id: 3,
    title: "ID:3",
    note: "Dolor",
    tags: [Tag.Work],
  },
  {
    id: 4,
    title: "ID:4",
    note: "Sit",
    tags: [Tag.Work, Tag.Study],
  },
];

function useCreateNote() {
  const [notes, setNotes] = useState(initialNotes);
  // TODO: Deliberately set selected to null on init, so we see all notes at first, The Pile Need so much works
  const [currentDate, setCurrentDate] = useState<Dayjs | null>(null);

  const value = React.useMemo(() => {
    return {
      notes,
      setNotes,
      currentDate,
      setCurrentDate,
    };
  }, [notes, currentDate]);

  return { value };
}

const NoteContext = createContext(
  undefined as unknown as ReturnType<typeof useCreateNote>["value"],
);

export const useNote = () => React.useContext(NoteContext);

type ProviderProps = {
  children: React.ReactNode;
};

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  const context = useCreateNote();

  return (
    <NoteContext.Provider value={context.value}>
      {children}
    </NoteContext.Provider>
  );
};
