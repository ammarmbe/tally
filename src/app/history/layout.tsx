import queryKeys from "@/utils/query-keys";
import { queryClient } from "@/utils/query-client";
import type { ReactNode } from "react";
import { TCourseHistory } from "@/utils/types";
import dayjs from "dayjs";

export default async function Layout({ children }: { children: ReactNode }) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.courses.history(
      dayjs().startOf("month").startOf("week").toDate(),
      dayjs().endOf("month").endOf("week").toDate()
    ),
    queryFn: async () => {
      const res = await fetch(
        `/api/courses/history?start=${dayjs().startOf("month").startOf("week").toDate()}&end=${dayjs().endOf("month").endOf("week").toDate()}`
      );

      if (!res.ok) {
        throw new Error("An error occurred while fetching the data.");
      }

      const data = (await res.json()) as TCourseHistory[];

      return data.map((item) => ({
        ...item,
        start: dayjs(item.start).toDate(),
        end: dayjs(item.end).toDate(),
        date: dayjs(item.date).toDate()
      }));
    }
  });

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col">
      <h1 className="p-4 pb-0 text-display-xs font-semibold sm:p-8 sm:pb-0 md:text-display-sm">
        My History
      </h1>
      {children}
    </main>
  );
}
