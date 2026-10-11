"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AccentPicker from "./AccentPicker";
import { useTheme } from "./ThemeProvider";

const links = [
  { href: "/dashboard", label: "Сегодня" },
  { href: "/history", label: "История" },
];

export default function AppHeader({ userName }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="brand-icon flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold text-white">
            C
          </span>
          <span className="hidden font-semibold tracking-tight sm:inline">
            Caloria Tracker
          </span>
        </Link>

        <nav className="flex items-center gap-1 rounded-full bg-[var(--muted)] p-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted-fg)] hover:text-[var(--foreground)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <AccentPicker compact />
          <button
            type="button"
            onClick={toggle}
            className="rounded-full border border-[var(--border)] p-2 text-sm transition hover:bg-[var(--muted)]"
            aria-label="Переключить тему"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <span className="hidden max-w-[120px] truncate text-sm text-[var(--muted-fg)] sm:inline">
            {userName}
          </span>
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-[var(--foreground)] px-3 py-2 text-xs font-medium text-[var(--background)] transition hover:opacity-90 sm:text-sm"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}
