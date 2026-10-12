/**
 * Создаёт таблицы в Turso. Запуск: npm run db:init
 * Нужны TURSO_DATABASE_URL и TURSO_AUTH_TOKEN в .env.local
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@libsql/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
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

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("❌ Добавьте TURSO_DATABASE_URL в .env.local");
  process.exit(1);
}

const db = createClient({ url, authToken });
const schema = fs.readFileSync(path.join(root, "lib", "schema.sql"), "utf-8");
const statements = schema
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const sql of statements) {
  await db.execute(sql);
}

console.log("✅ Схема Turso применена (users, meals, burns)");
