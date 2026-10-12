import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { upsertUserFromGoogle } from "@/lib/db";
import { verifyGoogleCredential } from "@/lib/googleAuth";
import { getGoogleClientId } from "@/lib/googleConfig";

export async function POST(request) {
  if (!getGoogleClientId()) {
    return NextResponse.json(
      { error: "Вход через Google не настроен на сервере" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const credential = String(body.credential || "");
    if (!credential) {
      return NextResponse.json({ error: "Нет данных Google" }, { status: 400 });
    }

    const profile = await verifyGoogleCredential(credential);
    if (!profile.emailVerified) {
      return NextResponse.json(
        { error: "Подтвердите email в Google аккаунте" },
        { status: 403 }
      );
    }

    const user = await upsertUserFromGoogle({
      googleId: profile.googleId,
      email: profile.email,
      name: profile.name,
    });

    await createSession(user.id);

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return NextResponse.json(
      { error: "Не удалось войти через Google" },
      { status: 401 }
    );
  }
}
