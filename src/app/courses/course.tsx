import { TCourse } from "@/utils/types";
import dayjs from "dayjs";
import { Clock, Ellipsis, MapPin } from "lucide-react";
import { useMemo } from "react";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  defaultDate,
  groupCourseTimes,
  calculateNextClass,
  days
} from "@/utils/client";
import EditCourse from "./edit-course";
import buttonStyles from "@/utils/styles/button";
import Dropdown from "@/components/dropdown";
import DeleteCourse from "./delete-course";

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

export default function Course({ course }: { course: TCourse }) {
  const groupedCourseTimes = useMemo(
    () => groupCourseTimes(course.courseTimes),
    [course.courseTimes]
  );

  const nextClass = useMemo(
    () => calculateNextClass(course.courseTimes),
    [course.courseTimes]
  );

  return (
    <div className="text-secondary flex h-full flex-col rounded-xl border p-4 shadow-xs transition-all">
      <div className="flex flex-grow flex-col">
        <div className="flex items-center justify-between gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-primary text-text-lg font-semibold md:text-text-xl">
              {course.name}{" "}
              {course.abbreviation ? (
                <span className="text-secondary text-text-md capitalize">
                  ({course.abbreviation})
                </span>
              ) : null}
            </h2>
            <p className="flex items-center text-text-sm font-medium">
              Next class: {nextClass}
            </p>
          </div>
          <div className="flex items-center gap-3 self-start">
            <div
              className={`flex size-10 flex-none items-center justify-center self-start rounded-full text-text-sm font-bold leading-none tracking-wider text-white ${course.attendance.percentage >= 75 ? "bg-brand-solid" : course.attendance.percentage >= 50 ? "bg-warning-solid" : "bg-error-solid"}`}
            >
              {course.attendance.label}
            </div>
            <Dropdown
              trigger={
                <button
                  className={buttonStyles(
                    {
                      size: "sm",
                      variant: "tertiary",
                      symmetrical: true
                    },
                    "self-start"
                  )}
                >
                  <Ellipsis size={16} />
                </button>
              }
            >
              <EditCourse course={course} />
              <DeleteCourse course={course} />
            </Dropdown>
          </div>
        </div>
        <div className="my-5 border-t" />
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center gap-2 self-center">
            <p className="text-secondary text-text-sm">Attended</p>
            <p className="text-text-lg font-semibold">
              {course.total_attended}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 self-center">
            <p className="text-secondary text-text-sm">Missed</p>
            <p className="text-text-lg font-semibold">{course.total_missed}</p>
          </div>
        </div>
        <div className="my-5 border-t" />
        <div className="flex flex-col gap-5">
          {groupedCourseTimes.map((courseTime) => (
            <div key={courseTime.dayOfWeek}>
              <p className="text-primary mb-2 text-text-sm font-medium">
                {days[courseTime.dayOfWeek]?.long}
              </p>
              <div className="flex flex-col gap-3.5">
                {courseTime.times.map((time) => (
                  <div key={time.startTime}>
                    <div className="text-secondary flex items-center gap-2 font-medium">
                      <Clock size={16} />
                      <p className="flex items-center text-text-sm">
                        {time.startTime
                          ? dayjs(defaultDate + time.startTime).format("h:mm A")
                          : "N/A"}{" "}
                        -{" "}
                        {time.startTime
                          ? dayjs(defaultDate + time.endTime).format("h:mm A")
                          : "N/A"}
                      </p>
                    </div>
                    <div className="text-secondary mt-1 flex items-center gap-2">
                      <MapPin size={16} />
                      <p className="flex items-center text-text-sm font-medium">
                        {time.room || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
