import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) return redirect("/login");

  return children;
}
