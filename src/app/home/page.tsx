"use client";

import { useUser } from "@/utils/client";
import queryKeys from "@/utils/query-keys";
import buttonStyles from "@/utils/styles/button";
import { TCourseTime } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { BookMinus, Plus } from "lucide-react";
import Link from "next/link";
import Course from "./course";
import Loading from "./loading";

export default function Page() {
  const user = useUser();

  const { data, isLoading } = useQuery({
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

  if (data === null) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center gap-2">
        <h2 className="text-text-md font-semibold md:text-text-lg">
          No courses found.
        </h2>
        <p className="text-secondary text-text-md">
          You have not added any courses yet.
        </p>
        <Link
          href="/courses/add"
          className={buttonStyles(
            {
              size: "sm",
              variant: "primary"
            },
            "mt-4"
          )}
        >
          <Plus size={16} /> Add course
        </Link>
      </div>
    );
  }

  if (data && !data.length) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center gap-2">
        <h2 className="text-text-md font-semibold md:text-text-lg">
          No courses for today! 🎉
        </h2>
        <p className="text-secondary text-text-md">
          Enjoy your day off{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
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
      className="grid gap-4 p-8"
    >
      {data?.map((course) => (
        <Course
          key={course.id}
          course={course}
          user={user}
          date={dayjs().toDate()}
        />
      ))}
    </div>
  );
}
