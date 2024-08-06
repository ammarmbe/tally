import { useToast } from "@/components/toast/use-toast";
import queryKeys from "@/utils/query-keys";
import { TCourseTime } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Clock, MapPin } from "lucide-react";
import { twMerge } from "tailwind-merge";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { User } from "next-auth";
import { calculatePercentage } from "@/utils/shared";

dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Course({
  course,
  date,
  user
}: {
  course: TCourseTime;
  date: string;
  user: User | undefined | null;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const attendanceMutation = useMutation({
    mutationFn: async (status: "ATTENDED" | "MISSED" | "CANCELLED") => {
      const res = await fetch(`/api/courses/attendance`, {
        method: "POST",
        body: JSON.stringify({ status, date, courseId: course.course.id })
      });

      if (!res.ok) {
        throw new Error("An error occurred while updating the attendance.");
      }
    },
    onMutate: async (status) => {
      const newStatus = course.status === status ? "" : status;

      queryClient.setQueryData<TCourseTime[]>(
        queryKeys.courses.date(date),
        (data) =>
          data?.map((c) => {
            if (c.id !== course.id) {
              return c;
            }

            const attended =
              newStatus === "ATTENDED" && c.status !== "ATTENDED"
                ? c.attended + 1
                : newStatus !== "ATTENDED" && c.status === "ATTENDED"
                  ? c.attended - 1
                  : c.attended;
            const missed =
              newStatus === "MISSED" && c.status !== "MISSED"
                ? c.missed + 1
                : newStatus !== "MISSED" && c.status === "MISSED"
                  ? c.missed - 1
                  : c.missed;
            const cancelled =
              newStatus === "CANCELLED" && c.status !== "CANCELLED"
                ? c.cancelled + 1
                : newStatus !== "CANCELLED" && c.status === "CANCELLED"
                  ? c.cancelled - 1
                  : c.cancelled;

            const attendance = calculatePercentage(
              attended,
              missed,
              cancelled,
              user?.countCancelledCourses,
              user?.attendanceAsPercentage
            );

            return {
              ...c,
              status: newStatus,
              attendance,
              attended,
              missed,
              cancelled
            };
          })
      );
    },
    onError: () => {
      toast({
        type: "foreground",
        title: "An error occurred",
        description: "An error occurred while updating the attendance."
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.date(date)
      });
    }
  });

  return (
    <div
      className={`flex h-full flex-col rounded-xl border p-4 shadow-xs transition-all ${
        course.status === "ATTENDED"
          ? "bg-success_card border-success_card text-secondary_success"
          : course.status === "MISSED"
            ? "bg-error_card border-error_card text-secondary_error"
            : course.status === "CANCELLED"
              ? "bg-secondary_subtle text-secondary border-primary"
              : "text-secondary"
      }`}
    >
      <div className="flex flex-grow justify-between gap-5">
        <div className="flex flex-grow flex-col">
          <div className="flex flex-col gap-1">
            <h2 className="text-text-lg font-semibold md:text-text-xl">
              <span
                className={
                  course.status === "ATTENDED"
                    ? "text-primary_success"
                    : course.status === "MISSED"
                      ? "text-primary_error"
                      : "text-primary"
                }
              >
                {course.course.name}
              </span>{" "}
              {course.course.abbreviation ? (
                <span className="text-text-md capitalize">
                  ({course.course.abbreviation})
                </span>
              ) : null}
            </h2>
            {course.startTime || course.endTime ? (
              <p className="flex items-center text-text-sm font-medium">
                {dayjs().isBetween(
                  dayjs(`${date} ${course.startTime}`),
                  dayjs(`${date} ${course.endTime}`),
                  "minute"
                )
                  ? "Now"
                  : dayjs().isBefore(dayjs(`${date} ${course.startTime}`))
                    ? dayjs(`${date} ${course.startTime}`).fromNow()
                    : dayjs(`${date} ${course.endTime}`).fromNow()}
              </p>
            ) : null}
          </div>
          {course.startTime || course.endTime ? (
            <div className="mt-3 flex items-center gap-2 font-medium">
              <Clock size={16} />
              <p className="flex items-center text-text-sm">
                {[
                  dayjs(`${date} ${course.startTime}`).format("h:mm A"),
                  dayjs(`${date} ${course.endTime}`).format("h:mm A")
                ].join(" - ")}
              </p>
            </div>
          ) : null}
          {course.room ? (
            <div className="mt-1 flex items-center gap-2">
              <MapPin size={16} />
              <p className="flex items-center text-text-sm font-medium">
                {course.room}
              </p>
            </div>
          ) : null}
        </div>
        <div
          className={`text-primary flex size-10 flex-none items-center justify-center self-start rounded-full text-text-sm font-bold leading-none tracking-wider ${course.attendance.percentage >= 80 ? "bg-brand-solid" : course.attendance.percentage >= 60 ? "bg-warning-solid" : "bg-error-solid"}`}
        >
          {course.attendance.label}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            className={twMerge(
              "flex h-fit items-center justify-center gap-2 rounded-md border px-3 py-2 !text-text-sm font-semibold transition-all active:shadow-focus-ring-gray",
              course.status === "CANCELLED"
                ? "border-transparent bg-gray-900 text-gray-100 hover:bg-gray-700 active:bg-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 dark:active:bg-gray-100"
                : "hover:bg-secondary text-secondary hover:text-primary active:bg-primary bg-primary hover:border-primary"
            )}
            onClick={() => attendanceMutation.mutate("CANCELLED")}
          >
            Cancelled
          </button>
          <button
            className={twMerge(
              "flex h-fit items-center justify-center gap-2 rounded-md border px-3 py-2 !text-text-sm font-semibold transition-all active:shadow-focus-ring-error",
              course.status === "MISSED"
                ? "bg-error-solid hover text-primary border-transparent"
                : "hover:bg-error_card text-secondary hover:text-error-primary hover:border-error_card active:bg-primary bg-primary"
            )}
            onClick={() => attendanceMutation.mutate("MISSED")}
          >
            Missed
          </button>
        </div>
        <button
          className={twMerge(
            "flex h-fit items-center justify-center gap-2 rounded-md border px-3 py-2 !text-text-sm font-semibold transition-all active:shadow-focus-ring",
            course.status === "ATTENDED"
              ? "bg-brand-solid hover text-primary border-transparent"
              : "hover:bg-success_card text-secondary hover:text-brand_card hover:border-success_card active:bg-primary bg-primary"
          )}
          onClick={() => attendanceMutation.mutate("ATTENDED")}
        >
          Attended
        </button>
      </div>
    </div>
  );
}
