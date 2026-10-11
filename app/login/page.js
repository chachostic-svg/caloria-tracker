import AuthForm from "@/components/AuthForm";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";

export const instant = false;

export default async function LoginPage() {
  if (await getSessionUserId()) redirect("/dashboard");

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[var(--bg-gradient)] px-4 py-12">
      <AuthForm mode="login" />
    </div>
  );
}
