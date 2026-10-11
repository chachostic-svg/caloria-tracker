import { NextResponse } from "next/server";
import { saveGoogleConfig } from "@/lib/googleConfig";

export async function POST(request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Только для разработки" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const clientId = String(body.clientId || "").trim();
    const clientSecret = String(body.clientSecret || "").trim();

    if (!clientId.includes(".apps.googleusercontent.com")) {
      return NextResponse.json(
        { error: "Некорректный Client ID" },
        { status: 400 }
      );
    }

    saveGoogleConfig({ clientId, clientSecret: clientSecret || undefined });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить" }, { status: 500 });
  }
}
