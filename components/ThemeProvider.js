"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  ACCENT_PALETTES,
  applyAccentVariables,
  DEFAULT_ACCENT,
  getChartColors,
} from "@/lib/accentPalettes";

const ThemeContext = createContext({
  theme: "light",
  toggle: () => {},
  accent: DEFAULT_ACCENT,
  setAccent: () => {},
  chartColors: getChartColors(DEFAULT_ACCENT),
  palettes: ACCENT_PALETTES,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [accent, setAccentState] = useState(DEFAULT_ACCENT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("caloria-theme");
    const storedAccent = localStorage.getItem("caloria-accent");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : prefersDark
          ? "dark"
          : "light";
    const initialAccent =
      storedAccent && ACCENT_PALETTES[storedAccent] ? storedAccent : DEFAULT_ACCENT;
    setTheme(initialTheme);
    setAccentState(initialAccent);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("caloria-theme", theme);
    applyAccentVariables(accent, theme);
  }, [theme, accent, mounted]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const setAccent = (id) => {
    if (!ACCENT_PALETTES[id]) return;
    setAccentState(id);
    localStorage.setItem("caloria-accent", id);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle,
        accent,
        setAccent,
        chartColors: getChartColors(accent),
        palettes: ACCENT_PALETTES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
