import dayjs from "dayjs";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { Clock, Clock7, MapPin } from "lucide-react";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import "react-circular-progressbar/dist/styles.css";

dayjs.extend(relativeTime);
dayjs.extend(isBetween);

export default function DashboardCourse({
  course,
}: {
  course: {
    course_name: string;
    course_id: string;
    room: string;
    start: string;
    date?: string;
    end: string;
    attended: string;
    missed: string;
    status: string | null;
  };
}) {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<
    "attended" | "cancelled" | "missed" | undefined
  >(course.status as "attended" | "cancelled" | "missed" | undefined);

  const attendanceMutation = useMutation({
    mutationKey: ["attendance"],
    mutationFn: async ({
      course_id,
      status: newStatus,
      date,
    }: {
      course_id: string;
      status: "attended" | "missed" | "cancelled";
      date?: string;
    }) => {
      const res = await fetch("/api/attendance", {
        method: "POST",
        body: JSON.stringify({
          course_id,
          status: newStatus,
          date: date ? dayjs(date).format("YYYY-MM-DD") : undefined,
        }),
      });

      return res.ok;
    },
    onMutate: async ({ status: newStatus }) => {
      await queryClient.setQueryData(
        ["dashboard"],
        (
          oldData:
            | {
                no_courses: boolean;
                courses: {
                  course_name: string;
                  course_id: string;
                  start: string;
                  end: string;
                  attended: string;
                  missed: string;
                  status: string | null;
                }[];
              }
            | undefined,
        ) => {
          if (!oldData) return;

          return {
            ...oldData,
            courses: oldData.courses.map((c) => {
              if (c.course_id !== course.course_id) return c;

              return {
                ...c,
                status: newStatus,
                attended:
                  newStatus === "attended"
                    ? Number(c.attended) + 1
                    : status === "attended"
                      ? Number(c.attended) - 1
                      : Number(c.attended),
                missed:
                  newStatus === "missed"
                    ? Number(c.missed) + 1
                    : status === "missed"
                      ? Number(c.missed) - 1
                      : Number(c.missed),
              };
            }),
          };
        },
      );

      await queryClient.setQueryData(
        ["history"],
        (
          oldData:
            | InfiniteData<
                {
                  course_id: string;
                  entry_id: number;
                  date: string;
                  course_name: string;
                  day: string;
                  start: string;
                  end: string;
                  attended: string;
                  missed: string;
                  status: string;
                }[],
                unknown
              >
            | undefined,
        ) => {
          if (!oldData) return;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return page.map((c) => {
                if (c.course_id !== course.course_id) return c;

                return {
                  ...c,
                  status: newStatus,
                  attended:
                    newStatus === "attended"
                      ? Number(c.attended) + 1
                      : status === "attended"
                        ? Number(c.attended) - 1
                        : Number(c.attended),
                  missed:
                    newStatus === "missed"
                      ? Number(c.missed) + 1
                      : status === "missed"
                        ? Number(c.missed) - 1
                        : Number(c.missed),
                };
              });
            }),
          };
        },
      );

      setStatus(newStatus);
    },
    onError: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "dashboard" || query.queryKey[0] === "history",
      });
      setStatus(course.status as "attended" | "cancelled" | "missed");
    },
  });

  const { data: time } = useQuery({
    queryKey: ["time", course.course_id],
    queryFn: () => {
      return dayjs().isBetween(
        dayjs().format("YYYY-MM-DD ") + course.start,
        dayjs().format("YYYY-MM-DD ") + course.end,
      )
        ? "now"
        : dayjs().isBefore(dayjs().format("YYYY-MM-DD ") + course.start)
          ? "upcoming"
          : "ended";
    },
    refetchInterval: 1000 * 60,
  });

  return (
    <Card key={course.course_id} className="h-fit max-w-[calc(100vw-2rem)]">
      <CardHeader>
        <div
          className={`flex justify-between gap-10 ${
            (course.start && course.end) ||
            (course.date &&
              dayjs(course.date).format("YYYY-MM-DD") !==
                dayjs().format("YYYY-MM-DD"))
              ? "items-start"
              : "items-center"
          }`}
        >
          <div className="flex min-w-0 flex-grow flex-col gap-1.5">
            <CardTitle className="max-w-sm truncate leading-normal">
              {course.course_name}
            </CardTitle>
            {course.date &&
            dayjs(course.date).format("YYYY-MM-DD") !==
              dayjs().format("YYYY-MM-DD") ? (
              <p className="flex items-center gap-1.5 font-medium text-muted-foreground">
                <Clock className="size-4" strokeWidth={2.25} />
                {dayjs(course.date).fromNow()}
              </p>
            ) : course.start && course.end ? (
              <p
                className={`flex items-center gap-1.5 font-medium ${
                  time === "now" ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                <Clock className="size-4" strokeWidth={2.25} />
                {time === "now"
                  ? "Now"
                  : time === "upcoming"
                    ? dayjs().to(dayjs().format("YYYY-MM-DD ") + course.start)
                    : dayjs(dayjs().format("YYYY-MM-DD ") + course.end).from(
                        dayjs(),
                      )}
              </p>
            ) : null}
          </div>
          <div className="size-12 flex-none">
            <CircularProgressbar
              value={
                Number(course.attended) + Number(course.missed) === 0
                  ? 100
                  : Math.round(
                      (Number(course.attended) /
                        (Number(course.attended) + Number(course.missed))) *
                        100,
                    )
              }
              text={
                Number(course.attended) + Number(course.missed) === 0
                  ? "100"
                  : Math.round(
                      (Number(course.attended) /
                        (Number(course.attended) + Number(course.missed))) *
                        100,
                    ) + ""
              }
              background
              backgroundPadding={6}
              strokeWidth={6}
              styles={buildStyles({
                backgroundColor: (
                  Number(course.attended) + Number(course.missed) === 0
                    ? 100
                    : Math.round(
                        (Number(course.attended) /
                          (Number(course.attended) + Number(course.missed))) *
                          100,
                      ) >= 75
                )
                  ? "#3e98c7"
                  : (
                        Number(course.attended) + Number(course.missed) === 0
                          ? 100
                          : Math.round(
                              (Number(course.attended) /
                                (Number(course.attended) +
                                  Number(course.missed))) *
                                100,
                            ) >= 50
                      )
                    ? "#e8960f"
                    : "#d60001",
                textColor: "#fff",
                pathColor: "#fff",
                trailColor: "transparent",
                textSize: "1.75rem",
              })}
            />
          </div>
        </div>
      </CardHeader>
      {(course.start && course.end) || course.room ? (
        <CardContent>
          {course.start && course.end ? (
            <div className="flex items-center gap-1.5">
              <Clock7 className="size-4 text-accent-foreground" />
              <span>
                {dayjs(dayjs().format("YYYY-MM-DD ") + course.start).format(
                  "hh:mm A",
                )}
              </span>{" "}
              –{" "}
              <span>
                {dayjs(dayjs().format("YYYY-MM-DD ") + course.end).format(
                  "hh:mm A",
                )}
              </span>
            </div>
          ) : null}
          {course.room ? (
            <div className="mt-1.5 flex items-center gap-1.5">
              <MapPin className="size-4 text-accent-foreground" />
              <span>{course.room}</span>
            </div>
          ) : null}
        </CardContent>
      ) : null}
      <CardFooter>
        <ToggleGroup
          type="single"
          className="flex-wrap justify-start"
          onValueChange={(v) => {
            attendanceMutation.mutate({
              course_id: course.course_id,
              status: v as "attended" | "missed" | "cancelled",
              date: course.date,
            });
          }}
          defaultValue={status}
        >
          <ToggleGroupItem
            value="attended"
            variant="outline"
            className="text-[#1d7f2d] hover:border-[#1d7f2d]/20 hover:bg-[#1d7f2d]/10 hover:text-[#1d7f2d] active:bg-[#1d7f2d]/20 active:text-[#1d7f2d] data-[state=on]:border-[#1d7f2d]/20 data-[state=on]:bg-[#1d7f2d]/20 data-[state=on]:text-[#1d7f2d] data-[state=on]:active:bg-[#1d7f2d]/30"
          >
            Attended
          </ToggleGroupItem>
          <ToggleGroupItem
            value="cancelled"
            variant="outline"
            className="hover:border-[#828487]/20 hover:bg-[#828487]/5 active:bg-[#828487]/20 data-[state=on]:border-[#828487]/20 data-[state=on]:bg-[#828487]/20 data-[state=on]:active:bg-[#828487]/30"
          >
            Cancelled
          </ToggleGroupItem>
          <ToggleGroupItem
            value="missed"
            variant="outline"
            className="text-destructive hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive active:bg-destructive/20 active:text-destructive data-[state=on]:border-destructive/20 data-[state=on]:bg-destructive/20 data-[state=on]:text-destructive data-[state=on]:active:bg-destructive/30"
          >
            Missed
          </ToggleGroupItem>
        </ToggleGroup>
      </CardFooter>
    </Card>
  );
}
