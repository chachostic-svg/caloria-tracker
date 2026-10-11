import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

const EMPTY_DB = { users: [], meals: [], burns: [] };

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(EMPTY_DB, null, 2), "utf-8");
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function findUserByEmail(email) {
  const db = readDb();
  return db.users.find((u) => u.email === email.toLowerCase()) ?? null;
}

export function findUserById(id) {
  const db = readDb();
  return db.users.find((u) => u.id === id) ?? null;
}

export function findUserByGoogleId(googleId) {
  const db = readDb();
  return db.users.find((u) => u.googleId === googleId) ?? null;
}

export function createUser({ email, name, passwordHash, googleId = null }) {
  const db = readDb();
  const user = {
    id: randomUUID(),
    email: email.toLowerCase(),
    name: name.trim(),
    passwordHash: passwordHash ?? null,
    googleId: googleId ?? null,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  return user;
}

/** Вход или регистрация через Google; при совпадении email привязывает Google к аккаунту. */
export function upsertUserFromGoogle({ googleId, email, name }) {
  const db = readDb();
  const normalizedEmail = email.toLowerCase();

  let user = db.users.find((u) => u.googleId === googleId);
  if (user) return user;

  user = db.users.find((u) => u.email === normalizedEmail);
  if (user) {
    user.googleId = googleId;
    if (name?.trim()) user.name = name.trim();
    writeDb(db);
    return user;
  }

  user = {
    id: randomUUID(),
    email: normalizedEmail,
    name: (name || normalizedEmail.split("@")[0]).trim(),
    passwordHash: null,
    googleId,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  return user;
}

export function getMealsForUser(userId, date) {
  const db = readDb();
  return db.meals
    .filter((m) => m.userId === userId && m.date === date)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getBurnsForUser(userId, date) {
  const db = readDb();
  return db.burns
    .filter((b) => b.userId === userId && b.date === date)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function addMeal(userId, data) {
  const db = readDb();
  const meal = {
    id: randomUUID(),
    userId,
    date: data.date,
    name: data.name.trim(),
    category: data.category,
    mealType: data.mealType,
    calories: data.calories,
    createdAt: new Date().toISOString(),
  };
  db.meals.push(meal);
  writeDb(db);
  return meal;
}

export function deleteMeal(userId, mealId) {
  const db = readDb();
  const idx = db.meals.findIndex((m) => m.id === mealId && m.userId === userId);
  if (idx === -1) return false;
  db.meals.splice(idx, 1);
  writeDb(db);
  return true;
}

export function addBurn(userId, data) {
  const db = readDb();
  const burn = {
    id: randomUUID(),
    userId,
    date: data.date,
    activity: data.activity.trim(),
    calories: data.calories,
    createdAt: new Date().toISOString(),
  };
  db.burns.push(burn);
  writeDb(db);
  return burn;
}

export function deleteBurn(userId, burnId) {
  const db = readDb();
  const idx = db.burns.findIndex((b) => b.id === burnId && b.userId === userId);
  if (idx === -1) return false;
  db.burns.splice(idx, 1);
  writeDb(db);
  return true;
}

export function getHistoryDates(userId) {
  const db = readDb();
  const dates = new Set();
  for (const m of db.meals) {
    if (m.userId === userId) dates.add(m.date);
  }
  for (const b of db.burns) {
    if (b.userId === userId) dates.add(b.date);
  }
  return [...dates].sort((a, b) => b.localeCompare(a));
}

export function getDaySummary(userId, date) {
  const meals = getMealsForUser(userId, date);
  const burns = getBurnsForUser(userId, date);
  const eaten = meals.reduce((s, m) => s + m.calories, 0);
  const burned = burns.reduce((s, b) => s + b.calories, 0);
  return { meals, burns, eaten, burned, balance: eaten - burned };
}
