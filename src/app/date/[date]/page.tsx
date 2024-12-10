"use client";

import queryKeys from "@/utils/query-keys";
import buttonStyles from "@/utils/styles/button";
import { TCourseTime } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { BookMinus } from "lucide-react";
import Link from "next/link";
import Course from "./course";
import Loading from "./loading";
import { useUser } from "@/utils/client";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ date: string }> }) {
  const user = useUser();
  const { date } = use(params);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.courses.date(
      date === "today" ? dayjs().format("YYYY-MM-DD") : date
    ),
    queryFn: async () => {
      const res = await fetch(
        `/api/courses/date/${date === "today" ? dayjs().format("YYYY-MM-DD") : date}`
      );

      if (!res.ok) {
        throw new Error();
      }

      return await res.json() as Promise<TCourseTime[]>;
    }
  });

  if (data && !data.length) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center gap-2">
        <h2 className="text-text-lg font-semibold">
          {date === "today"
            ? "No courses for today! 🎉"
            : "No courses for this day."}
        </h2>
        <p className="text-secondary text-text-md">
          {date === "today"
            ? `Enjoy your day off${user?.name ? `, ${user.name.split(" ")[0]}` : ""}.`
            : `You ${dayjs().isBefore(dayjs(date), "day") ? "have" : "had"} no courses on this day.`}
        </p>
        <Link
          href="/courses"
          className={buttonStyles(
            {
              size: "sm",
              variant: "primary"
            },
            "mt-4"
          )}
        >
          <BookMinus size={16} /> View courses
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
      }}
      className="grid gap-4 p-4 sm:p-8"
    >
      {data?.map((course) => (
        <Course
          key={course.id}
          course={course}
          date={
            date === "today" ? dayjs().format("YYYY-MM-DD") : date
          }
          user={user}
        />
      ))}
    </div>
  );
}
