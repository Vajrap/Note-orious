import React, { createContext, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export enum Tag {
  work = "work",
  study = "study",
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
    tags: [Tag.study],
  },
  {
    id: 3,
    title: "ID:3",
    note: "Dolor",
    tags: [Tag.work],
  },
  {
    id: 4,
    title: "ID:4",
    note: "Sit",
    tags: [Tag.work, Tag.study],
  },
];

// Filtering Enums
export enum FilterMode {
  All = "all",
  Dated = "dated",
  NoDate = "nodate",
}

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

function useCreateNote() {
  const [notes, setNotes] = useState(initialNotes);
  const [currentDate, setCurrentDate] = useState<Dayjs | null>(null);

  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.All);
  const [showPast, setShowPast] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.desc);

  const [filterTag, setFilterTag] = useState<Tag | null>(null);

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (filterMode === FilterMode.Dated) {
      result = result.filter((note) => !!note.date);
    } else if (filterMode === FilterMode.NoDate) {
      result = result.filter((note) => !note.date);
    }

    if (filterTag !== null) {
      result = result.filter((note) => note.tags.includes(filterTag));
    }

    if (currentDate) {
      const targetDate = currentDate.format("YYYY-MM-DD");
      result = result.filter((note) => note.date === targetDate);
    }

    if (!showPast) {
      const now = dayjs();
      result = result.filter(
        (n) => !n.date || dayjs(n.date).isSameOrAfter(now, "day"),
      );
    }

    result.sort((a, b) => {
      if (a.date && b.date) {
        return sortOrder === "asc"
          ? dayjs(a.date).unix() - dayjs(b.date).unix()
          : dayjs(b.date).unix() - dayjs(a.date).unix();
      } else if (a.date && !b.date) return -1;
      else if (!a.date && b.date) return 1;
      else return 0;
    });

    return result;
  }, [notes, currentDate, filterMode, showPast, sortOrder, filterTag]);

  const value = useMemo(() => {
    return {
      notes,
      setNotes,
      currentDate,
      setCurrentDate,
      filterMode,
      setFilterMode,
      showPast,
      setShowPast,
      sortOrder,
      setSortOrder,
      filteredNotes,
      filterTag,
      setFilterTag,
    };
  }, [
    notes,
    currentDate,
    filterMode,
    showPast,
    sortOrder,
    filteredNotes,
    setNotes,
    filterTag,
  ]);

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
