import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

let client;

export function getTurso() {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL не задан. Добавьте его в .env.local (см. README)."
    );
  }

  client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return client;
}

export async function runSchema() {
  const sqlPath = path.join(process.cwd(), "lib", "schema.sql");
  const sql = fs.readFileSync(sqlPath, "utf-8");
  const db = getTurso();
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await db.execute(statement);
  }
}
