import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { addMeal, getMealsForUser } from "@/lib/db";
import { todayKey } from "@/lib/dates";

async function requireUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return userId;
}

export async function GET(request) {
  const userId = await requireUser();
  if (!userId) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || todayKey();
  const meals = getMealsForUser(userId, date);
  return NextResponse.json({ meals });
}

export async function POST(request) {
  const userId = await requireUser();
  if (!userId) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const body = await request.json();
  const name = String(body.name || "").trim();
  const category = String(body.category || "other");
  const mealType = String(body.mealType || "snack");
  const calories = Number(body.calories);
  const date = String(body.date || todayKey());

  if (!name || !Number.isFinite(calories) || calories <= 0) {
    return NextResponse.json(
      { error: "Укажите название и калории больше 0" },
      { status: 400 }
    );
  }

  const meal = addMeal(userId, {
    name,
    category,
    mealType,
    calories: Math.round(calories),
    date,
  });
  return NextResponse.json({ meal });
}
