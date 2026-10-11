"use client";

import { FOOD_CATEGORIES, MEAL_TYPES } from "@/lib/constants";

function categoryLabel(id) {
  return FOOD_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function mealTypeLabel(id) {
  return MEAL_TYPES.find((m) => m.id === id)?.label ?? id;
}

export function MealList({ meals, onDelete }) {
  if (!meals.length) {
    return (
      <p className="text-sm text-[var(--muted-fg)]">Пока нет записей о еде</p>
    );
  }
  return (
    <ul className="space-y-2">
      {meals.map((m) => (
        <li
          key={m.id}
          className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 px-3 py-2.5"
        >
          <div>
            <p className="font-medium">{m.name}</p>
            <p className="text-xs text-[var(--muted-fg)]">
              {categoryLabel(m.category)} · {mealTypeLabel(m.mealType)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-stat-eaten">+{m.calories}</span>
            <button
              type="button"
              onClick={() => onDelete(m.id)}
              className="text-xs text-[var(--muted-fg)] hover:text-red-500"
              aria-label="Удалить"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function BurnList({ burns, onDelete }) {
  if (!burns.length) {
    return (
      <p className="text-sm text-[var(--muted-fg)]">Нет записей о сжигании</p>
    );
  }
  return (
    <ul className="space-y-2">
      {burns.map((b) => (
        <li
          key={b.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 px-3 py-2.5"
        >
          <p className="font-medium">{b.activity}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-stat-burned">−{b.calories}</span>
            <button
              type="button"
              onClick={() => onDelete(b.id)}
              className="text-xs text-[var(--muted-fg)] hover:text-red-500"
              aria-label="Удалить"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
