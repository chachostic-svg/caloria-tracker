import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getDaySummary, getHistoryDates } from "@/lib/db";
import { todayKey } from "@/lib/dates";

export async function GET(request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || todayKey();
  const summary = getDaySummary(userId, date);

  const chartData = summary.meals.map((m) => ({
    name: m.name,
    calories: m.calories,
    id: m.id,
  }));

  const totalEaten = summary.eaten;
  const chartWithPercent = chartData.map((item) => ({
    ...item,
    percent: totalEaten > 0 ? Math.round((item.calories / totalEaten) * 100) : 0,
  }));

  return NextResponse.json({
    date,
    eaten: summary.eaten,
    burned: summary.burned,
    balance: summary.balance,
    meals: summary.meals,
    burns: summary.burns,
    chart: chartWithPercent,
  });
}
