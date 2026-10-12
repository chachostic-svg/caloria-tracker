import HistoryClient from "@/components/HistoryClient";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { findUserById } from "@/lib/db";

export const instant = false;

export default async function HistoryPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  const user = await findUserById(userId);
  if (!user) redirect("/login");

  return (
    <HistoryClient
      user={{ id: user.id, name: user.name, email: user.email }}
    />
  );
}
