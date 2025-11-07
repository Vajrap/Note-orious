"use client";
import { AppBar, CssBaseline, Toolbar, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { Provider } from "./useNote";
import { Calendar } from "./Components/Calendar";
import { Pile } from "./Components/Pile";
import { NoteSection } from "./Components/NoteSection";
import style from "./style.module.scss";

enum Mode {
  light = "light",
  dark = "dark",
}

export default function Home() {
  const [mode] = useState(Mode.light);
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
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
              <NoteSection />
            </div>
          </div>
        </Provider>
      </CssBaseline>
    </ThemeProvider>
  );
}
