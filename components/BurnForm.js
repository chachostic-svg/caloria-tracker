"use client";

import { useState } from "react";

const PRESETS = [
  { activity: "Ходьба 30 мин", calories: 150 },
  { activity: "Бег 30 мин", calories: 300 },
  { activity: "Тренажёрный зал", calories: 250 },
  { activity: "Йога", calories: 120 },
];

export default function BurnForm({ date, onAdded }) {
  const [activity, setActivity] = useState("");
  const [calories, setCalories] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/burns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activity,
        calories: Number(calories),
        date,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }
    setActivity("");
    setCalories("");
    onAdded?.();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.activity}
            type="button"
            onClick={() => {
              setActivity(p.activity);
              setCalories(String(p.calories));
            }}
            className="rounded-full border border-[var(--border)] px-3 py-1 text-xs transition hover:bg-[var(--muted)]"
          >
            {p.activity}
          </button>
        ))}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Активность</label>
        <input
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Плавание, велосипед…"
          className="input-field"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Сожжено (ккал)</label>
        <input
          type="number"
          min={1}
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="input-field"
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="btn-secondary w-full">
        {loading ? "Сохранение…" : "Добавить активность"}
      </button>
    </form>
  );
}
