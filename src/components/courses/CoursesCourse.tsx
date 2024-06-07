import dayjs from "dayjs";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import "react-circular-progressbar/dist/styles.css";

export default function CoursesCourse({
  course,
}: {
  course: {
    course_name: string;
    course_id: string;
    attended: string;
    missed: string;
    cancelled: string;
    times: string[][];
  };
}) {
  return (
    <Card
      key={course.course_id}
      className="h-fit max-w-[calc(100vw-2rem)] sm:max-w-xs"
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-10">
          <div className="flex min-w-0 flex-grow flex-col gap-1.5">
            <CardTitle className="max-w-sm truncate leading-normal">
              {course.course_name}
            </CardTitle>
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
      <CardContent>
        <p className="mb-6 flex flex-wrap gap-x-3 font-medium">
          <span>Attended {course.attended}</span>
          <span>–</span>
          <span>Missed {course.missed}</span>
          <span>–</span>
          <span>Cancelled {course.cancelled}</span>
        </p>
        {course.times.every((time) => time[1] === null && time[2] === null) ? (
          <>
            <p className="mb-1 font-medium">Days</p>
            <p className="capitalize">
              {course.times
                .map(
                  (time) =>
                    `${time[0].slice(0, 3)}${time[3] ? ` (${time[3]})` : ""}`,
                )
                .join(", ")}
            </p>
          </>
        ) : (
          <>
            <p className="mb-1 font-medium">Times</p>
            <div className="flex flex-col gap-2">
              {course.times.map((time) => (
                <div key={time[0]} className="flex flex-col">
                  <p className="capitalize">
                    {time[0]?.slice(0, 3)}
                    {time[3] ? ` - Room ${time[3]}` : ""}
                  </p>
                  {time[1] && time[2] ? (
                    <p>
                      {dayjs(dayjs().format("YYYY-MM-DD ") + time[1]).format(
                        "hh:mm A",
                      )}{" "}
                      -{" "}
                      {dayjs(dayjs().format("YYYY-MM-DD ") + time[2]).format(
                        "hh:mm A",
                      )}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
