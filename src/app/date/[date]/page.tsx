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

export default function Page({ params }: { params: { date: string } }) {
  const user = useUser();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.courses.date(params.date),
    queryFn: async () => {
      const res = await fetch(`/api/courses/date/${params.date}`);

      if (!res.ok) {
        throw new Error("An error occurred while fetching the data.");
      }

      return res.json() as Promise<TCourseTime[]>;
    }
  });

  if (data && !data.length) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center gap-2">
        <h2 className="text-text-md font-semibold md:text-text-lg">
          {dayjs().isSame(dayjs(params.date), "day")
            ? "No courses for today! 🎉"
            : "No courses for this day."}
        </h2>
        <p className="text-secondary text-text-md">
          {dayjs().isSame(dayjs(params.date), "day")
            ? `Enjoy your day off${user?.name ? `, ${user.name.split(" ")[0]}` : ""}.`
            : `You ${dayjs().isBefore(dayjs(params.date), "day") ? "had" : "have"} no courses on this day.`}
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
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
      }}
      className="grid gap-4 p-4 sm:p-8"
    >
      {data?.map((course) => (
        <Course
          key={course.id}
          course={course}
          date={params.date}
          user={user}
        />
      ))}
    </div>
  );
}
