import { randomUUID } from "crypto";
import { getTurso } from "@/lib/turso";

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    googleId: row.google_id,
    createdAt: row.created_at,
  };
}

function mapMeal(row) {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    name: row.name,
    category: row.category,
    mealType: row.meal_type,
    calories: Number(row.calories),
    createdAt: row.created_at,
  };
}

function mapBurn(row) {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    activity: row.activity,
    calories: Number(row.calories),
    createdAt: row.created_at,
  };
}

export async function findUserByEmail(email) {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT * FROM users WHERE email = ? LIMIT 1",
    args: [email.toLowerCase()],
  });
  return mapUser(result.rows[0]);
}

export async function findUserById(id) {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT * FROM users WHERE id = ? LIMIT 1",
    args: [id],
  });
  return mapUser(result.rows[0]);
}

export async function findUserByGoogleId(googleId) {
  const db = getTurso();
  const result = await db.execute({
    sql: "SELECT * FROM users WHERE google_id = ? LIMIT 1",
    args: [googleId],
  });
  return mapUser(result.rows[0]);
}

export async function createUser({ email, name, passwordHash, googleId = null }) {
  const db = getTurso();
  const user = {
    id: randomUUID(),
    email: email.toLowerCase(),
    name: name.trim(),
    passwordHash: passwordHash ?? null,
    googleId: googleId ?? null,
    createdAt: new Date().toISOString(),
  };
  await db.execute({
    sql: `INSERT INTO users (id, email, name, password_hash, google_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      user.id,
      user.email,
      user.name,
      user.passwordHash,
      user.googleId,
      user.createdAt,
    ],
  });
  return user;
}

export async function upsertUserFromGoogle({ googleId, email, name }) {
  const existingByGoogle = await findUserByGoogleId(googleId);
  if (existingByGoogle) return existingByGoogle;

  const normalizedEmail = email.toLowerCase();
  const existingByEmail = await findUserByEmail(normalizedEmail);
  if (existingByEmail) {
    const db = getTurso();
    const displayName = name?.trim() || existingByEmail.name;
    await db.execute({
      sql: "UPDATE users SET google_id = ?, name = ? WHERE id = ?",
      args: [googleId, displayName, existingByEmail.id],
    });
    return { ...existingByEmail, googleId, name: displayName };
  }

  return createUser({
    email: normalizedEmail,
    name: (name || normalizedEmail.split("@")[0]).trim(),
    passwordHash: null,
    googleId,
  });
}

export async function getMealsForUser(userId, date) {
  const db = getTurso();
  const result = await db.execute({
    sql: `SELECT * FROM meals WHERE user_id = ? AND date = ? ORDER BY created_at DESC`,
    args: [userId, date],
  });
  return result.rows.map(mapMeal);
}

export async function getBurnsForUser(userId, date) {
  const db = getTurso();
  const result = await db.execute({
    sql: `SELECT * FROM burns WHERE user_id = ? AND date = ? ORDER BY created_at DESC`,
    args: [userId, date],
  });
  return result.rows.map(mapBurn);
}

export async function addMeal(userId, data) {
  const db = getTurso();
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
  await db.execute({
    sql: `INSERT INTO meals (id, user_id, date, name, category, meal_type, calories, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      meal.id,
      meal.userId,
      meal.date,
      meal.name,
      meal.category,
      meal.mealType,
      meal.calories,
      meal.createdAt,
    ],
  });
  return meal;
}

export async function deleteMeal(userId, mealId) {
  const db = getTurso();
  const result = await db.execute({
    sql: "DELETE FROM meals WHERE id = ? AND user_id = ?",
    args: [mealId, userId],
  });
  return result.rowsAffected > 0;
}

export async function addBurn(userId, data) {
  const db = getTurso();
  const burn = {
    id: randomUUID(),
    userId,
    date: data.date,
    activity: data.activity.trim(),
    calories: data.calories,
    createdAt: new Date().toISOString(),
  };
  await db.execute({
    sql: `INSERT INTO burns (id, user_id, date, activity, calories, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      burn.id,
      burn.userId,
      burn.date,
      burn.activity,
      burn.calories,
      burn.createdAt,
    ],
  });
  return burn;
}

export async function deleteBurn(userId, burnId) {
  const db = getTurso();
  const result = await db.execute({
    sql: "DELETE FROM burns WHERE id = ? AND user_id = ?",
    args: [burnId, userId],
  });
  return result.rowsAffected > 0;
}

export async function getHistoryDates(userId) {
  const db = getTurso();
  const result = await db.execute({
    sql: `
      SELECT date FROM meals WHERE user_id = ?
      UNION
      SELECT date FROM burns WHERE user_id = ?
      ORDER BY date DESC
    `,
    args: [userId, userId],
  });
  return result.rows.map((r) => r.date);
}

export async function getDaySummary(userId, date) {
  const meals = await getMealsForUser(userId, date);
  const burns = await getBurnsForUser(userId, date);
  const eaten = meals.reduce((s, m) => s + m.calories, 0);
  const burned = burns.reduce((s, b) => s + b.calories, 0);
  return { meals, burns, eaten, burned, balance: eaten - burned };
}
