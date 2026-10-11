"use client";

import { useCallback, useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import CaloriePieChart from "./CaloriePieChart";
import MealForm from "./MealForm";
import BurnForm from "./BurnForm";
import { MealList, BurnList } from "./EntryList";
import { formatDisplayDate, todayKey } from "@/lib/dates";

export default function DashboardClient({ user }) {
  const [date] = useState(todayKey());
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/summary?date=${date}`);
    if (res.ok) {
      setSummary(await res.json());
    }
    setLoading(false);
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  async function deleteMeal(id) {
    await fetch(`/api/meals/${id}`, { method: "DELETE" });
    load();
  }

  async function deleteBurn(id) {
    await fetch(`/api/burns/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="min-h-full bg-[var(--bg-gradient)]">
      <AppHeader userName={user.name} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-medium text-accent-label">Сегодня</p>
          <h1 className="text-3xl font-bold tracking-tight capitalize">
            {formatDisplayDate(date)}
          </h1>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Съедено" value={summary?.eaten ?? 0} unit="ккал" />
          <StatCard label="Сожжено" value={summary?.burned ?? 0} unit="ккал" />
          <StatCard
            label="Баланс"
            value={summary?.balance ?? 0}
            unit="ккал"
            hint="съедено − сожжено"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card">
            <h2 className="mb-4 text-lg font-semibold">Доля калорий сегодня</h2>
            {loading ? (
              <div className="h-64 animate-pulse rounded-2xl bg-[var(--muted)]" />
            ) : (
              <CaloriePieChart data={summary?.chart ?? []} />
            )}
          </section>

          <div className="space-y-6">
            <section className="card">
              <h2 className="mb-4 text-lg font-semibold">Добавить еду</h2>
              <MealForm date={date} onAdded={load} />
            </section>
            <section className="card">
              <h2 className="mb-4 text-lg font-semibold">Сжигание калорий</h2>
              <BurnForm date={date} onAdded={load} />
            </section>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="card">
            <h2 className="mb-4 text-lg font-semibold">Съедено сегодня</h2>
            <MealList meals={summary?.meals ?? []} onDelete={deleteMeal} />
          </section>
          <section className="card">
            <h2 className="mb-4 text-lg font-semibold">Активность</h2>
            <BurnList burns={summary?.burns ?? []} onDelete={deleteBurn} />
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, unit, hint }) {
  return (
    <div className="stat-card rounded-2xl border p-5">
      <p className="stat-card-caption text-sm">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums">
        {value}
        <span className="stat-card-caption ml-1 text-base font-normal">{unit}</span>
      </p>
      {hint && <p className="stat-card-caption mt-1 text-xs">{hint}</p>}
    </div>
  );
}
