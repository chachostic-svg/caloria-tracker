import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getHistoryDates, getDaySummary } from "@/lib/db";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const dates = await getHistoryDates(userId);
  const days = await Promise.all(
    dates.map(async (date) => {
      const s = await getDaySummary(userId, date);
      return {
        date,
        eaten: s.eaten,
        burned: s.burned,
        balance: s.balance,
        mealCount: s.meals.length,
      };
    })
  );
  return NextResponse.json({ days });
}
