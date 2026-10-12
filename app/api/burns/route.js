import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { addBurn, getBurnsForUser } from "@/lib/db";
import { todayKey } from "@/lib/dates";

export async function GET(request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || todayKey();
  const burns = await getBurnsForUser(userId, date);
  return NextResponse.json({ burns });
}

export async function POST(request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const body = await request.json();
  const activity = String(body.activity || "").trim();
  const calories = Number(body.calories);
  const date = String(body.date || todayKey());

  if (!activity || !Number.isFinite(calories) || calories <= 0) {
    return NextResponse.json(
      { error: "Укажите активность и калории больше 0" },
      { status: 400 }
    );
  }

  const burn = await addBurn(userId, {
    activity,
    calories: Math.round(calories),
    date,
  });
  return NextResponse.json({ burn });
}
