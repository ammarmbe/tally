"use client";

import queryKeys from "@/utils/query-keys";
import buttonStyles from "@/utils/styles/button";
import { TCourse } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import Course from "./course";
import Loading from "./loading";

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.courses.all(),
    queryFn: async () => {
      const res = await fetch("/api/courses/all");

      if (!res.ok) {
        throw new Error();
      }

      return res.json() as Promise<TCourse[]>;
    }
  });

  if (data && !data.length) {
    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-5 p-4 pb-0 sm:p-8 sm:pb-0">
          <h1 className="text-display-xs font-semibold md:text-display-sm">
            My Courses
          </h1>
          <Link
            href="/courses/add"
            className={buttonStyles({
              size: "sm",
              variant: "primary"
            })}
          >
            <Plus size={16} /> Add course
          </Link>
        </div>
        <div className="flex flex-grow flex-col items-center justify-center gap-2">
          <h2 className="text-text-lg font-semibold">No courses found.</h2>
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
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-5 p-4 pb-0 sm:p-8 sm:pb-0">
          <h1 className="text-display-xs font-semibold md:text-display-sm">
            My Courses
          </h1>
          <Link
            href="/courses/add"
            className={buttonStyles({
              size: "sm",
              variant: "primary"
            })}
          >
            <Plus size={16} /> Add course
          </Link>
        </div>
        <Loading />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-5 p-4 pb-0 sm:p-8 sm:pb-0">
        <h1 className="text-display-xs font-semibold md:text-display-sm">
          My Courses
        </h1>
        <Link
          href="/courses/add"
          className={buttonStyles({
            size: "sm",
            variant: "primary"
          })}
        >
          <Plus size={16} /> Add course
        </Link>
      </div>
      <div
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
        }}
        className="grid gap-4 p-4 sm:p-8"
      >
        {data?.map((course) => <Course key={course.id} course={course} />)}
      </div>
    </>
  );
}
