import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const name = String(body.name || "").trim();
    const password = String(body.password || "");

    if (!email || !name || password.length < 6) {
      return NextResponse.json(
        { error: "Заполните имя, email и пароль (минимум 6 символов)" },
        { status: 400 }
      );
    }

    if (await findUserByEmail(email)) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ email, name, passwordHash });
    await createSession(user.id);

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch {
    return NextResponse.json({ error: "Ошибка регистрации" }, { status: 500 });
  }
}
