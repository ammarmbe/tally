import { useToast } from "@/components/toast/use-toast";
import queryKeys from "@/utils/query-keys";
import { TCourseTime } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Clock, MapPin } from "lucide-react";
import { twMerge } from "tailwind-merge";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import { User } from "next-auth";
import { calculatePercentage } from "@/utils/shared";

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

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
    mutationFn: async (attended: boolean) => {
      const res = await fetch(`/api/courses/attendance`, {
        method: "POST",
        body: JSON.stringify({ attended, date, courseId: course.course.id })
      });

      if (!res.ok) {
        throw new Error("An error occurred while updating the attendance.");
      }
    },
    onMutate: async (attended) => {
      const newStatus = course.attended === attended ? undefined : attended;

      queryClient.setQueryData<TCourseTime[]>(
        queryKeys.courses.date(date),
        (data) =>
          data?.map((c) => {
            if (c.id !== course.id) {
              return c;
            }

            const total_attended =
              newStatus === true && c.attended !== true
                ? c.total_attended + 1
                : newStatus !== true && c.attended === true
                  ? c.total_attended - 1
                  : c.total_attended;

            const total_missed =
              newStatus === false && c.attended !== false
                ? c.total_missed + 1
                : newStatus !== false && c.attended === false
                  ? c.total_missed - 1
                  : c.total_missed;

            const attendance = calculatePercentage(
              total_attended,
              total_missed,
              user?.attendanceAsPercentage
            );

            return {
              ...c,
              attended: newStatus ?? null,
              attendance,
              total_attended,
              total_missed
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
        course.attended === true
          ? "bg-success_card border-success_card text-secondary_success"
          : course.attended === false
            ? "bg-error_card border-error_card text-secondary_error"
            : "text-secondary"
      }`}
    >
      <div className="flex flex-grow justify-between gap-5">
        <div className="flex flex-grow flex-col">
          <div className="flex flex-col gap-1">
            <h2 className="text-text-lg font-semibold md:text-text-xl">
              <span
                className={
                  course.attended === true
                    ? "text-primary_success"
                    : course.attended === false
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
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          className={twMerge(
            "flex h-fit items-center justify-center gap-2 rounded-md border px-3 py-2 !text-text-sm font-semibold transition-all active:shadow-focus-ring",
            course.attended === true
              ? "bg-brand-solid hover text-primary border-transparent"
              : "hover:bg-success_card text-secondary hover:text-brand_card hover:border-success_card active:bg-primary bg-primary"
          )}
          onClick={() => attendanceMutation.mutate(true)}
        >
          Attended
        </button>
        <button
          className={twMerge(
            "flex h-fit items-center justify-center gap-2 rounded-md border px-3 py-2 !text-text-sm font-semibold transition-all active:shadow-focus-ring-error",
            course.attended === false
              ? "bg-error-solid hover text-primary border-transparent"
              : "hover:bg-error_card text-secondary hover:text-error-primary hover:border-error_card active:bg-primary bg-primary"
          )}
          onClick={() => attendanceMutation.mutate(false)}
        >
          Missed
        </button>
      </div>
    </div>
  );
}
