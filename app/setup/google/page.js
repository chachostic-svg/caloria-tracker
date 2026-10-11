"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GoogleSetupPage() {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/setup/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, clientSecret }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error || "Ошибка");
      return;
    }
    setMessage("Готово! Можно входить через Google.");
    setTimeout(() => router.push("/login"), 800);
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[var(--bg-gradient)] px-4 py-12">
      <div className="card w-full max-w-lg">
        <h1 className="text-xl font-bold">Настройка Google OAuth</h1>
        <p className="mt-2 text-sm text-[var(--muted-fg)]">
          Один раз создайте OAuth Client ID в Google Cloud и вставьте сюда. Данные
          сохраняются локально в <code className="text-xs">data/google-oauth.json</code>.
        </p>

        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--muted-fg)]">
          <li>
            Откройте{" "}
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noreferrer"
              className="text-accent-link"
            >
              Google Cloud → Credentials
            </a>
          </li>
          <li>Create credentials → OAuth client ID → Web application</li>
          <li>
            Authorized JavaScript origins:{" "}
            <code className="rounded bg-[var(--muted)] px-1">http://localhost:3000</code>
          </li>
          <li>
            Authorized redirect URIs:{" "}
            <code className="rounded bg-[var(--muted)] px-1">
              http://localhost:3000/api/auth/google/callback
            </code>
          </li>
          <li>Скопируйте Client ID и Client Secret ниже</li>
        </ol>

        <form onSubmit={save} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Client ID</label>
            <input
              className="input-field"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="....apps.googleusercontent.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Client Secret</label>
            <input
              className="input-field"
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              required
            />
          </div>
          {message && (
            <p className={`text-sm ${message.startsWith("Готово") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Сохранение…" : "Сохранить и включить Google"}
          </button>
        </form>

        <Link href="/login" className="mt-4 block text-center text-sm text-accent-link">
          ← Назад ко входу
        </Link>
      </div>
    </div>
  );
}
