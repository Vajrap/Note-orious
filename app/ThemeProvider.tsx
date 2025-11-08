"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export enum Mode {
  light = "light",
  dark = "dark",
}

type ThemeModeContextType = {
  themeMode: Mode;
  setThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  theme: ReturnType<typeof createTheme>;
};

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(
  undefined,
);

type ThemeModeProviderProps = {
  children: ReactNode;
};

export const ThemeModeProvider: React.FC<ThemeModeProviderProps> = ({
  children,
}) => {
  const [themeMode, setThemeMode] = useState<Mode>(Mode.light);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode],
  );

  return (
    <ThemeModeContext.Provider value={{ themeMode, setThemeMode, theme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
};
