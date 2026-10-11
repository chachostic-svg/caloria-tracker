"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ERROR_MESSAGES = {
  oauth_state: "Ошибка безопасности OAuth. Попробуйте снова.",
  google_failed: "Не удалось войти через Google. Проверьте Client ID/Secret и redirect URI.",
  redirect_uri:
    "Неверный redirect URI. В Google Cloud добавьте: http://localhost:3000/api/auth/google/callback",
  email_not_verified: "Подтвердите email в Google.",
  access_denied: "Вы отменили вход через Google.",
};

export default function GoogleSignInButton({ mode = "login", onError }) {
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) onError?.(ERROR_MESSAGES[err] || "Ошибка входа через Google");
  }, [searchParams, onError]);

  useEffect(() => {
    fetch("/api/config/google")
      .then((r) => r.json())
      .then((data) => {
        setConfigured(Boolean(data.configured));
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  if (!ready) {
    return <div className="h-11 animate-pulse rounded-xl bg-[var(--muted)]" />;
  }

  if (!configured) {
    return (
      <Link
        href="/setup/google"
        className="btn-secondary flex w-full items-center justify-center gap-2"
      >
        <GoogleIcon />
        Настроить вход через Google
      </Link>
    );
  }

  const label =
    mode === "register" ? "Регистрация через Google" : "Войти через Google";

  return (
    <a
      href="/api/auth/google/start"
      className="btn-secondary flex w-full items-center justify-center gap-2"
    >
      <GoogleIcon />
      {label}
    </a>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 29.082 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 29.082 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.223 0-9.654-3.343-11.303-8H6.306C9.656 39.663 16.318 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
