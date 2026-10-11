import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const password = String(body.password || "");

    const user = findUserByEmail(email);
    if (!user?.passwordHash) {
      return NextResponse.json(
        {
          error:
            "Этот email зарегистрирован через Google. Войдите кнопкой Google.",
        },
        { status: 401 }
      );
    }
    if (!(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    await createSession(user.id);
    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch {
    return NextResponse.json({ error: "Ошибка входа" }, { status: 500 });
  }
}
