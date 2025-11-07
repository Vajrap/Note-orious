"use client";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { Provider } from "./useNote";
import style from "./style.module.scss";
import { Calendar } from "./Components/Calendar";

enum Mode {
  light = "light",
  dark = "dark",
}

export default function Home() {
  // Theme
  const [mode, setMode] = useState(Mode.light);
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  // const {setCurrentDate, currentDate} = useNote();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Provider>
          <section className={style.verticalBox}>
            <section className={style.horizontalBox}>
              {/*Calendar component*/}
              <Calendar />
              {/*Note component*/}
            </section>
            <section>{/*Note form*/}</section>
          </section>
        </Provider>
      </CssBaseline>
    </ThemeProvider>
  );
}
