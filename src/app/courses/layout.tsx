import queryKeys from "@/utils/query-keys";
import { TCourse } from "@/utils/types";
import { queryClient } from "@/utils/query-client";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) return redirect("/login");

  await queryClient.prefetchQuery({
    queryKey: queryKeys.courses.all(),
    queryFn: async () => {
      const res = await fetch("/api/courses/all");

      if (!res.ok) {
        throw new Error();
      }

      return res.json() as Promise<TCourse[]>;
    }
  });

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col">
      {children}
    </main>
  );
}
