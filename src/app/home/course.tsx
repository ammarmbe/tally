import { useToast } from "@/components/toast/use-toast";
import queryKeys from "@/utils/query-keys";
import { TCourseTime } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Clock, MapPin } from "lucide-react";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import { User } from "next-auth";

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

export default function Course({
  course,
  user,
  date
}: {
  course: TCourseTime;
  user: User | null | undefined;
  date: Date;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const attendance = useMemo(() => {
    let percentage =
      (course.attended /
        (course.missed +
          course.attended +
          (user?.countCancelledCourses ? course.cancelled : 0))) *
      100;

    if (isNaN(percentage)) {
      percentage = 100;
    }

    if (user?.attendanceAsPercentage === false) {
      return {
        label: `${course.attended} / ${course.missed + course.attended + (user?.countCancelledCourses ? course.cancelled : 0)}`,
        percentage: Math.round(percentage)
      };
    }

    return {
      label: Math.round(percentage).toString(),
      percentage: Math.round(percentage)
    };
  }, [
    course.attended,
    course.cancelled,
    course.missed,
    user?.attendanceAsPercentage,
    user?.countCancelledCourses
  ]);

  const attendanceMutation = useMutation({
    mutationFn: async (status: "ATTENDED" | "MISSED" | "CANCELLED") => {
      const response = await fetch(`/api/courses/attendance`, {
        method: "POST",
        body: JSON.stringify({ status, date, courseId: course.course.id })
      });

      if (!response.ok) {
        throw new Error("An error occurred while updating the attendance.");
      }
    },
    onMutate: async (status) => {
      const newStatus = course.status === status ? "" : status;

      queryClient.setQueryData<TCourseTime[]>(
        queryKeys.courses(dayjs(date).day()),
        (data) =>
          data?.map((c) => {
            if (c.id !== course.id) {
              return c;
            }

            return {
              ...c,
              status: newStatus,
              attended:
                newStatus === "ATTENDED" && c.status !== "ATTENDED"
                  ? c.attended + 1
                  : newStatus !== "ATTENDED" && c.status === "ATTENDED"
                    ? c.attended - 1
                    : c.attended,
              missed:
                newStatus === "MISSED" && c.status !== "MISSED"
                  ? c.missed + 1
                  : newStatus !== "MISSED" && c.status === "MISSED"
                    ? c.missed - 1
                    : c.missed,
              cancelled:
                newStatus === "CANCELLED" && c.status !== "CANCELLED"
                  ? c.cancelled + 1
                  : newStatus !== "CANCELLED" && c.status === "CANCELLED"
                    ? c.cancelled - 1
                    : c.cancelled
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
        queryKey: queryKeys.courses(dayjs().day())
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
              ? "bg-secondary_subtle text-secondary"
              : ""
      }`}
    >
      <div className="flex justify-between gap-5">
        <div className="flex flex-grow flex-col">
          <div className="flex flex-col gap-1">
            <h2
              className={`text-text-lg font-semibold md:text-text-xl ${
                course.status === "ATTENDED"
                  ? "text-primary_success"
                  : course.status === "MISSED"
                    ? "text-primary_error"
                    : course.status === "CANCELLED"
                      ? "text-primary"
                      : ""
              }`}
            >
              {course.course.title}
            </h2>
            <p className="flex items-center text-text-sm font-medium">
              {dayjs().isBetween(
                dayjs(
                  dayjs().format("YYYY-MM-DD ") +
                    dayjs(course.startTime).format("HH:mm")
                ),
                dayjs().format("YYYY-MM-DD ") +
                  dayjs(course.endTime).format("HH:mm"),
                "minute"
              )
                ? "Now"
                : dayjs().isBefore(
                      dayjs(
                        dayjs().format("YYYY-MM-DD ") +
                          dayjs(course.startTime).format("HH:mm")
                      )
                    )
                  ? dayjs(
                      dayjs().format("YYYY-MM-DD ") +
                        dayjs(course.startTime).format("HH:mm")
                    ).fromNow()
                  : dayjs(
                      dayjs().format("YYYY-MM-DD ") +
                        dayjs(course.endTime).format("HH:mm")
                    ).toNow()}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 font-medium">
            <Clock size={16} />
            <p className="flex items-center text-text-sm">
              {dayjs(course.startTime).format("h:mm A")} -{" "}
              {dayjs(course.endTime).format("h:mm A")}
            </p>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <MapPin size={16} />
            <p className="flex items-center text-text-sm font-medium">
              {course.room}
            </p>
          </div>
        </div>
        <div
          className={`text-primary flex size-10 flex-none items-center justify-center rounded-full text-text-xs font-bold leading-none tracking-wider ${attendance.percentage >= 80 ? "bg-brand-solid" : attendance.percentage >= 60 ? "bg-warning-solid" : "bg-error-solid"}`}
        >
          {attendance.label}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          className={twMerge(
            "disabled:!text-disabled disabled:!border-disabled disabled:!bg-disabled flex h-fit items-center justify-center gap-2 rounded-md border px-3 py-2 !text-text-sm font-semibold transition-all active:shadow-focus-ring-gray disabled:!shadow-none",
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
            "disabled:!text-disabled disabled:!border-disabled disabled:!bg-disabled flex h-fit items-center justify-center gap-2 rounded-md border px-3 py-2 !text-text-sm font-semibold transition-all active:shadow-focus-ring-error disabled:!shadow-none",
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
          "disabled:!text-disabled disabled:!border-disabled disabled:!bg-disabled flex h-fit items-center justify-center gap-2 rounded-md border px-3 py-2 !text-text-sm font-semibold transition-all active:shadow-focus-ring disabled:!shadow-none",
          course.status === "ATTENDED"
            ? "bg-brand-solid hover text-primary border-transparent"
            : "hover:bg-success_card text-secondary hover:text-brand_card hover:border-success_card active:bg-primary bg-primary",
          "mt-2"
        )}
        onClick={() => attendanceMutation.mutate("ATTENDED")}
      >
        Attended
      </button>
    </div>
  );
}
