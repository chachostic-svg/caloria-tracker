import DashboardClient from "@/components/DashboardClient";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { findUserById } from "@/lib/db";

export const instant = false;

export default async function DashboardPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  const user = await findUserById(userId);
  if (!user) redirect("/login");

  return (
    <DashboardClient
      user={{ id: user.id, name: user.name, email: user.email }}
    />
  );
}
