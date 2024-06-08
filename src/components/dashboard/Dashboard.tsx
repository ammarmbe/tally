"use client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import Link from "next/link";
import { BookMarked, Plus } from "lucide-react";
import Spinner from "../Spinner";
import dayjs from "dayjs";
import DashboardCourse from "./DashboardCourse";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch(
        `/api/dashboard?day=${new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase()}`,
      );

      return (await res.json()) as {
        no_courses: boolean;
        courses: {
          course_name: string;
          course_id: string;
          start: string;
          room: string;
          end: string;
          attended: string;
          missed: string;
          status: string | null;
        }[];
      };
    },
  });

  if (isLoading)
    return (
      <section className="flex h-[calc(100dvh-4.5rem)] flex-col items-center justify-center px-4 pb-32 text-center">
        <Spinner size="lg" />
      </section>
    );

  if (data?.no_courses) {
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

  if (!data?.courses.length) {
    return (
      <section className="flex h-[calc(100dvh-4.5rem)] flex-col items-center justify-center px-4 pb-32 text-center">
        <h2 className="text-xl font-semibold sm:text-2xl">
          Enjoy your day off!
        </h2>
        <p className="mt-2 text-secondary-foreground">
          You don't have any courses scheduled for today.
        </p>
        <Button asChild size="sm" className="mt-6">
          <Link href="/courses">
            <BookMarked className="mr-2 size-4" />
            View courses
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="flex h-[calc(100dvh-4.5rem)] flex-col px-4 pb-32">
      <h2 className="pb-6 pt-2 text-xl font-semibold leading-none tracking-tight">
        {dayjs().format("dddd, MMMM D, YYYY")}
      </h2>
      <div className="grid flex-wrap gap-4 pb-4 sm:flex">
        {data?.courses.map((course) => (
          <DashboardCourse key={course.course_id} course={course} />
        ))}
      </div>
    </section>
  );
}
