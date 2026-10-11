"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import CaloriePieChart from "./CaloriePieChart";
import { MealList, BurnList } from "./EntryList";
import { formatDisplayDate } from "@/lib/dates";

export default function HistoryClient({ user }) {
  const [days, setDays] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDetail = useCallback(async (date) => {
    const res = await fetch(`/api/summary?date=${date}`);
    if (res.ok) setDetail(await res.json());
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setDays(data.days);
        if (data.days.length) {
          setSelected((prev) => prev || data.days[0].date);
        }
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (selected) loadDetail(selected);
  }, [selected, loadDetail]);

  async function deleteMeal(id) {
    await fetch(`/api/meals/${id}`, { method: "DELETE" });
    if (selected) await loadDetail(selected);
    const res = await fetch("/api/history");
    if (res.ok) setDays((await res.json()).days);
  }

  async function deleteBurn(id) {
    await fetch(`/api/burns/${id}`, { method: "DELETE" });
    if (selected) await loadDetail(selected);
    const res = await fetch("/api/history");
    if (res.ok) setDays((await res.json()).days);
  }

  return (
    <div className="min-h-full bg-[var(--bg-gradient)]">
      <AppHeader userName={user.name} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">История</h1>
        <p className="mb-8 text-[var(--muted-fg)]">
          Выберите день, чтобы увидеть, что вы ели и сколько калорий
        </p>

        {loading ? (
          <div className="h-40 animate-pulse rounded-2xl bg-[var(--muted)]" />
        ) : days.length === 0 ? (
          <div className="card text-center">
            <p className="text-[var(--muted-fg)]">История пока пуста</p>
            <Link href="/dashboard" className="btn-primary mt-4 inline-block">
              Добавить первую запись
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="card max-h-[70vh] overflow-y-auto p-2">
              <ul className="space-y-1">
                {days.map((d) => (
                  <li key={d.date}>
                    <button
                      type="button"
                      onClick={() => setSelected(d.date)}
                      className={`w-full rounded-xl px-3 py-3 text-left transition ${
                        selected === d.date
                          ? "history-day-active"
                          : "hover:bg-[var(--muted)]"
                      }`}
                    >
                      <p className="text-sm font-medium capitalize">
                        {formatDisplayDate(d.date)}
                      </p>
                      <p className="text-xs text-[var(--muted-fg)]">
                        {d.eaten} ккал · {d.mealCount} блюд
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {detail && selected && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <MiniStat label="Съедено" value={detail.eaten} />
                  <MiniStat label="Сожжено" value={detail.burned} />
                  <MiniStat label="Баланс" value={detail.balance} />
                </div>
                <section className="card">
                  <h2 className="mb-4 text-lg font-semibold">Диаграмма дня</h2>
                  <CaloriePieChart data={detail.chart} />
                </section>
                <div className="grid gap-6 md:grid-cols-2">
                  <section className="card">
                    <h2 className="mb-4 font-semibold">Еда</h2>
                    <MealList meals={detail.meals} onDelete={deleteMeal} />
                  </section>
                  <section className="card">
                    <h2 className="mb-4 font-semibold">Активность</h2>
                    <BurnList burns={detail.burns} onDelete={deleteBurn} />
                  </section>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <p className="text-xs text-[var(--muted-fg)]">{label}</p>
      <p className="text-xl font-bold">{value} ккал</p>
    </div>
  );
}
