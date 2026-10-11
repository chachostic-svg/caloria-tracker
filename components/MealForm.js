"use client";

import { useState } from "react";
import {
  FOOD_CATEGORIES,
  MEAL_TYPES,
  PRESET_FOODS,
} from "@/lib/constants";

export default function MealForm({ date, onAdded }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("other");
  const [mealType, setMealType] = useState("lunch");
  const [calories, setCalories] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function applyPreset(presetName) {
    const preset = PRESET_FOODS.find((p) => p.name === presetName);
    if (preset) {
      setName(preset.name);
      setCategory(preset.category);
      setCalories(String(preset.calories));
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        mealType,
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
    setName("");
    setCalories("");
    onAdded?.();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Блюдо</label>
        <input
          list="preset-foods"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            applyPreset(e.target.value);
          }}
          placeholder="Яблоко, суп, своё название…"
          className="input-field"
          required
        />
        <datalist id="preset-foods">
          {PRESET_FOODS.map((f) => (
            <option key={f.name} value={f.name} />
          ))}
        </datalist>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Категория</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {FOOD_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Приём пищи</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="input-field"
          >
            {MEAL_TYPES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Калории (ккал)</label>
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
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Сохранение…" : "Добавить еду"}
      </button>
    </form>
  );
}
