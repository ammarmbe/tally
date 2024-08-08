import queryKeys from "@/utils/query-keys";
import { TCourseTime } from "@/utils/types";
import { queryClient } from "@/utils/query-client";
import type { ReactNode } from "react";
import dayjs from "dayjs";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
  params
}: {
  children: ReactNode;
  params: { date: string };
}) {
  const session = await auth();

  if (!session?.user) return redirect("/login");

  await queryClient.prefetchQuery({
    queryKey: queryKeys.courses.date(
      params.date === "today" ? dayjs().format("YYYY-MM-DD") : params.date
    ),
    queryFn: async () => {
      const res = await fetch(
        `/api/courses/date/${params.date === "today" ? dayjs().format("YYYY-MM-DD") : params.date}`
      );

      if (!res.ok) {
        throw new Error();
      }

      return res.json() as Promise<TCourseTime[]>;
    }
  });

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col">
      <h1 className="p-4 pb-0 text-display-xs font-semibold sm:p-8 sm:pb-0 md:text-display-sm">
        {dayjs(params.date === "today" ? undefined : params.date).format(
          "dddd, MMMM D, YYYY"
        )}
      </h1>
      {children}
    </main>
  );
}
