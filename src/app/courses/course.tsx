import { TCourse } from "@/utils/types";
import dayjs from "dayjs";
import { Clock, MapPin, Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  defaultDate,
  groupCourseTimes,
  calculateNextClass
} from "@/utils/client";
import EditCourse from "./edit-course";
import EditCourseTimes from "./edit-course-times";
import Modal from "@/components/modal";
import buttonStyles from "@/utils/styles/button";

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

export default function Course({ course }: { course: TCourse }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newData, setNewData] = useState<{
    name: string;
    abbreviation: string;
    0: boolean;
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
    5: boolean;
    6: boolean;
  } | null>(null);

  const groupedCourseTimes = useMemo(
    () => groupCourseTimes(course.courseTimes),
    [course.courseTimes]
  );

  const nextClass = useMemo(
    () => calculateNextClass(course.courseTimes),
    [course.courseTimes]
  );

  useEffect(() => {
    if (modalOpen === false) {
      setNewData(null);
    }
  }, [modalOpen]);

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
              className={`flex size-10 flex-none items-center justify-center self-start rounded-full text-text-sm font-bold leading-none tracking-wider text-white ${course.attendance.percentage >= 80 ? "bg-brand-solid" : course.attendance.percentage >= 60 ? "bg-warning-solid" : "bg-error-solid"}`}
            >
              {course.attendance.label}
            </div>
            <Modal
              open={modalOpen}
              onOpenChange={setModalOpen}
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
                  <Pencil size={16} />
                </button>
              }
              saveButton={null}
              cancelButton={null}
              title="Edit course"
            >
              {newData ? (
                <EditCourseTimes
                  course={course}
                  setModalOpen={setModalOpen}
                  setNewData={setNewData}
                  newData={newData}
                />
              ) : (
                <EditCourse course={course} setNewData={setNewData} />
              )}
            </Modal>
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
            <div key={courseTime.id}>
              <p className="text-primary mb-2 text-text-sm font-medium">
                {courseTime.days
                  .map((day) =>
                    dayjs()
                      .day(day)
                      .format(courseTime.days.length === 1 ? "dddd" : "ddd")
                  )
                  .join(", ")}
              </p>
              <div className="text-secondary flex items-center gap-2 font-medium">
                <Clock size={16} />
                <p className="flex items-center text-text-sm">
                  {courseTime.startTime
                    ? dayjs(defaultDate + courseTime.startTime).format("h:mm A")
                    : "N/A"}{" "}
                  -{" "}
                  {courseTime.startTime
                    ? dayjs(defaultDate + courseTime.endTime).format("h:mm A")
                    : "N/A"}
                </p>
              </div>
              <div className="text-secondary mt-1 flex items-center gap-2">
                <MapPin size={16} />
                <p className="flex items-center text-text-sm font-medium">
                  {courseTime.room || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
