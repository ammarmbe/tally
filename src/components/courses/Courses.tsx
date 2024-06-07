"use client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import CoursesCourse from "./CoursesCourse";
import Spinner from "../Spinner";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Courses() {
  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await fetch("/api/courses");

      return (await res.json()) as {
        course_name: string;
        course_id: string;
        attended: string;
        missed: string;
        cancelled: string;
        times: string[][];
      }[];
    },
  });

  if (isLoading)
    return (
      <section className="flex h-[calc(100dvh-4.5rem)] flex-col items-center justify-center px-4 pb-32 text-center">
        <Spinner size="lg" />
      </section>
    );

  if (data && !data?.length) {
    return (
      <section className="flex h-[calc(100dvh-4.5rem)] flex-col items-center justify-center px-4 pb-32 text-center">
        <h2 className="text-xl font-semibold sm:text-2xl">
          You don't have any courses
        </h2>
        <p className="mt-2 text-secondary-foreground">
          Add courses to start tracking your attendance.
        </p>
        <Button asChild size="sm" className="mt-6">
          <Link href="/courses/add">
            <Plus className="mr-2 size-4" />
            Add course
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="flex h-[calc(100dvh-4.5rem)] flex-col px-4 pb-32">
      <h2 className="pb-6 pt-2 text-xl font-semibold leading-none tracking-tight">
        Your Courses
      </h2>
      <div className="grid flex-wrap gap-4 pb-4 sm:flex">
        {data?.map((course) => (
          <CoursesCourse key={course.course_id} course={course} />
        ))}
      </div>
    </section>
  );
}
