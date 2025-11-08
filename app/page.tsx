"use client";
import {
  AppBar,
  CssBaseline,
  Switch,
  ToggleButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Provider } from "./useNote";
import { Calendar } from "./Components/Calendar";
import { Pile } from "./Components/Pile";
import { NoteSection } from "./Components/NoteSection";
import style from "./style.module.scss";
import { FormikNoteSection } from "./Components/FormikNoteSection";
import { useThemeMode } from "./ThemeProvider";

enum Mode {
  light = "light",
  dark = "dark",
}

export default function Home() {
  const { setThemeMode } = useThemeMode();
  const handleToggleMode = () => {
    setThemeMode((prev) => (prev === Mode.light ? Mode.dark : Mode.light));
  };

  const [selectFormik, setSelectFormik] = useState(false);
  const handleToggleFormik = () => {
    setSelectFormik((prev) => !prev);
  };

  return (
    <CssBaseline>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Note-orious
          </Typography>
        </Toolbar>
      </AppBar>
      <Provider>
        <div className={style.wrapper}>
          <div className={style.mainRow}>
            <Calendar />
            <Pile />
          </div>
          <div className={style.noteSection}>
            {/*Use Formik Switch, just to Dev Formik, the production only use Anything Note Section*/}
            <Switch
              slotProps={{ input: { "aria-label": "UseFormik?" } }}
              onChange={handleToggleFormik}
            />
            {selectFormik ? <FormikNoteSection /> : <NoteSection />}
          </div>
        </div>
      </Provider>

      <div className={style.toggleThemeWrapper}>
        <ToggleButton
          className={style.toggleTheme}
          size="small"
          value="check"
          onChange={handleToggleMode}
        >
          ⏻
        </ToggleButton>
      </div>
    </CssBaseline>
  );
}
