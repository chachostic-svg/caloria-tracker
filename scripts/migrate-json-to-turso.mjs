/**
 * Перенос data/db.json → Turso (один раз). Запуск: npm run db:migrate
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@libsql/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const jsonPath = path.join(root, "data", "db.json");

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

if (!fs.existsSync(jsonPath)) {
  console.log("ℹ️  data/db.json не найден — нечего переносить.");
  process.exit(0);
}

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error("❌ TURSO_DATABASE_URL не задан");
  process.exit(1);
}

const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

for (const u of data.users || []) {
  await db.execute({
    sql: `INSERT OR IGNORE INTO users (id, email, name, password_hash, google_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      u.id,
      u.email,
      u.name,
      u.passwordHash ?? null,
      u.googleId ?? null,
      u.createdAt,
    ],
  });
}

for (const m of data.meals || []) {
  await db.execute({
    sql: `INSERT OR IGNORE INTO meals (id, user_id, date, name, category, meal_type, calories, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      m.id,
      m.userId,
      m.date,
      m.name,
      m.category,
      m.mealType,
      m.calories,
      m.createdAt,
    ],
  });
}

for (const b of data.burns || []) {
  await db.execute({
    sql: `INSERT OR IGNORE INTO burns (id, user_id, date, activity, calories, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [b.id, b.userId, b.date, b.activity, b.calories, b.createdAt],
  });
}

console.log(
  `✅ Перенесено: ${data.users?.length ?? 0} users, ${data.meals?.length ?? 0} meals, ${data.burns?.length ?? 0} burns`
);
