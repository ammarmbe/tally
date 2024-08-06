import queryKeys from "@/utils/query-keys";
import { TCourse } from "@/utils/types";
import { queryClient } from "@/utils/query-client";
import type { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.courses.all(),
    queryFn: async () => {
      const res = await fetch("/api/courses/all");

      if (!res.ok) {
        throw new Error("An error occurred while fetching the data.");
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
