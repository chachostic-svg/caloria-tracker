import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "data", "google-oauth.json");

function readFileConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) return null;
    const raw = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    if (raw?.clientId) return String(raw.clientId);
  } catch {
    /* ignore */
  }
  return null;
}

export function getGoogleClientId() {
  return (
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    readFileConfig() ||
    ""
  );
}

export function getGoogleClientSecret() {
  return process.env.GOOGLE_CLIENT_SECRET || readFileSecret() || "";
}

function readFileSecret() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) return null;
    const raw = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    if (raw?.clientSecret) return String(raw.clientSecret);
  } catch {
    /* ignore */
  }
  return null;
}

export function saveGoogleConfig({ clientId, clientSecret }) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    CONFIG_PATH,
    JSON.stringify(
      {
        clientId: clientId.trim(),
        clientSecret: clientSecret?.trim() || undefined,
      },
      null,
      2
    ),
    "utf-8"
  );
}

export function isGoogleConfigured() {
  return Boolean(getGoogleClientId() && getGoogleClientSecret());
}
