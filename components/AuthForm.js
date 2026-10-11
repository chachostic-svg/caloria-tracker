"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import AccentPicker from "./AccentPicker";
import GoogleSignInButton from "./GoogleSignInButton";

export default function AuthForm({ mode }) {
  const isLogin = mode === "login";
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { email, password, name };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="brand-icon mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white">
          C
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isLogin ? "С возвращением" : "Создайте аккаунт"}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-fg)]">
          {isLogin
            ? "Войдите, чтобы видеть свою историю калорий"
            : "Отслеживайте питание и активность каждый день"}
        </p>
        <div className="mt-5">
          <AccentPicker />
        </div>
      </div>

      <div className="mb-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-black/5">
        <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-[var(--muted)]" />}>
          <GoogleSignInButton mode={isLogin ? "login" : "register"} onError={setError} />
        </Suspense>
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wide">
            <span className="bg-[var(--surface)] px-2 text-[var(--muted-fg)]">или</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-black/5"
      >
        {!isLogin && (
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium">Имя</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium">Пароль</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-11"
              minLength={6}
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--muted-fg)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Подождите…" : isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted-fg)]">
        {isLogin ? (
          <>
            Нет аккаунта?{" "}
            <Link href="/register" className="text-accent-link">
              Регистрация
            </Link>
          </>
        ) : (
          <>
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-accent-link">
              Войти
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
