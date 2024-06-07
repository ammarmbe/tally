"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import DashboardCourse from "./dashboard/DashboardCourse";
import dayjs from "dayjs";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "./ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function History() {
  const { data, isLoading, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["history"],
      queryFn: async ({ pageParam }) => {
        const response = await fetch(`/api/history?cursor=${pageParam}`);
        return response.json() as Promise<
          {
            course_id: string;
            entry_id: number;
            date: string;
            course_name: string;
            day: string;
            start: string;
            room: string;
            end: string;
            attended: string;
            missed: string;
            status: string;
          }[]
        >;
      },

      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        // convert date and start to epoch
        const last = lastPage[lastPage.length - 1];
        const date = dayjs(last?.date).format("YYYY-MM-DD");
        const start = dayjs(`${date} 23:59:59`).valueOf();

        return start;
      },
    });

  if (isLoading)
    return (
      <section className="flex h-[calc(100dvh-4.5rem)] flex-col items-center justify-center px-4 pb-32 text-center">
        <Spinner size="lg" />
      </section>
    );

  if (data && !data.pages.flat().length) {
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

  return data ? (
    <section className="flex h-[calc(100dvh-4.5rem)] flex-col px-4 pb-32">
      <InfiniteScroll
        dataLength={
          Object.values(
            Object.groupBy(data.pages.flat(), (course) => course.date),
          ).length
        }
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className="flex items-center justify-center p-4">
            <Spinner size="sm" />
          </div>
        }
        endMessage={
          <p className="p-2 text-center text-muted-foreground">
            No more courses to show
          </p>
        }
        className="flex flex-col gap-6 pb-4"
        refreshFunction={refetch}
        pullDownToRefresh
        pullDownToRefreshThreshold={100}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        }
      >
        {Object.values(
          Object.groupBy(data.pages.flat(), (course) => course.date),
        ).map((courses, i) => (
          <div key={i} className="flex w-full flex-col gap-4">
            <h2 className="text-xl font-semibold leading-none tracking-tight">
              {dayjs(courses?.[0].date).format("dddd, MMMM D, YYYY")}{" "}
            </h2>
            <div className="grid flex-wrap gap-4 sm:flex">
              {courses?.map((course) => (
                <DashboardCourse
                  key={course.course_name + course.date}
                  course={course}
                />
              ))}
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </section>
  ) : null;
}
