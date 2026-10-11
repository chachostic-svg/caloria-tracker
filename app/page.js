import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";

export const instant = false;

export default async function Home() {
  const userId = await getSessionUserId();
  redirect(userId ? "/dashboard" : "/login");
}
