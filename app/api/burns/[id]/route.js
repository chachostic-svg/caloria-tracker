import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { deleteBurn } from "@/lib/db";

export async function DELETE(_request, { params }) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteBurn(userId, id);
  if (!ok) {
    return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
