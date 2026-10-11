"use client";

import { ACCENT_IDS } from "@/lib/accentPalettes";
import { useTheme } from "./ThemeProvider";

export default function AccentPicker({ compact = false }) {
  const { accent, setAccent, palettes } = useTheme();

  return (
    <div
      className={compact ? "flex items-center gap-1" : "flex flex-col items-center gap-2"}
      role="group"
      aria-label="Цвет сайта"
    >
      {!compact && (
        <span className="text-xs font-medium text-[var(--muted-fg)]">Цвет интерфейса</span>
      )}
      <div className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
        {ACCENT_IDS.map((id) => {
          const p = palettes[id];
          const selected = accent === id;
          return (
            <button
              key={id}
              type="button"
              title={p.label}
              onClick={() => setAccent(id)}
              className={`h-7 w-7 rounded-full transition ring-offset-2 ring-offset-[var(--surface)] ${
                selected ? "ring-2 ring-[var(--foreground)] scale-105" : "hover:scale-105"
              }`}
              style={{
                background: `linear-gradient(135deg, ${p.vars["--accent-gradient-from"]}, ${p.vars["--accent-gradient-to"]})`,
              }}
              aria-label={p.label}
              aria-pressed={selected}
            />
          );
        })}
      </div>
    </div>
  );
}
