import { FilterMode, SortOrder, Tag, useNote } from "@/app/useNote";
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
} from "@mui/material";
import { useMemo } from "react";

export function SearchAndFilterSection() {
  const {
    filterMode,
    setFilterMode,
    filterTag,
    setFilterTag,
    showPast,
    setShowPast,
    sortOrder,
    setSortOrder,
  } = useNote();

  const filterModeSwitcher = useMemo(() => {
    return (
      <RadioGroup value={filterMode}>
        <FormLabel>Filter Date Related Notes</FormLabel>
        <FormControlLabel
          value={FilterMode.Dated}
          onClick={() => {
            setFilterMode(FilterMode.Dated);
          }}
          control={<Radio />}
          label={FilterMode.Dated}
        />
        <FormControlLabel
          value={FilterMode.All}
          onClick={() => {
            setFilterMode(FilterMode.All);
          }}
          control={<Radio />}
          label={FilterMode.All}
        />
        <FormControlLabel
          value={FilterMode.NoDate}
          onClick={() => {
            setFilterMode(FilterMode.NoDate);
          }}
          control={<Radio />}
          label={FilterMode.NoDate}
        />
      </RadioGroup>
    );
  }, [filterMode, setFilterMode]);

  const tagSwitcher = useMemo(() => {
    return (
      <FormControl size="small">
        <FormLabel>Filter By Tags</FormLabel>
        <Select
          value={filterTag ?? "none"}
          label="filter by tag"
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
    );
  }, [filterTag, setFilterTag]);

  const showPastSwitcher = useMemo(() => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Show Past Notes?"
          onChange={() => setShowPast(() => !showPast)}
        />
      </div>
    );
  }, [showPast, setShowPast]);

  const dateOrderSort = useMemo(() => {
    return (
      <Button
        onClick={() =>
          setSortOrder((prev) =>
            prev === SortOrder.asc ? SortOrder.desc : SortOrder.asc,
          )
        }
      >
        Sort: {sortOrder === SortOrder.asc ? "ASC (↑)" : "DSC (↓)"}
      </Button>
    );
  }, [sortOrder, setSortOrder]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {filterModeSwitcher}
      <Divider style={{ margin: 20 }} />
      {tagSwitcher}
      <Divider style={{ margin: 20 }} />
      {showPastSwitcher}
      <Divider style={{ margin: 20 }} />
      {dateOrderSort}
    </div>
  );
}
