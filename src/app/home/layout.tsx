import queryKeys from "@/utils/query-keys";
import { TCourseTime } from "@/utils/types";
import dayjs from "dayjs";
import { queryClient } from "@/utils/query-client";
import type { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.courses(dayjs().day()),
    queryFn: async () => {
      const response = await fetch(`/api/courses/${dayjs().day()}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error("An error occurred while fetching the data.");
      }

      return response.json() as Promise<TCourseTime[]>;
    }
  });

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col">
      <h1 className="p-8 pb-0 text-display-xs font-semibold md:text-display-sm">
        {dayjs().format("dddd, MMMM D, YYYY")}
      </h1>
      {children}
    </main>
  );
}
