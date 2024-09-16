import buttonStyles from "@/utils/styles/button";
import { days } from "@/utils/client";
import { labelStyles, inputStyles, errorStyles } from "@/utils/styles/input";
import { TCourse } from "@/utils/types";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import queryKeys from "@/utils/query-keys";
import { useToast } from "@/components/toast/use-toast";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

type DaySchedule = {
  startTime: string | undefined;
  endTime: string | undefined;
  room: string | undefined;
};

type FormData = {
  "0": DaySchedule;
  "1": DaySchedule;
  "2": DaySchedule;
  "3": DaySchedule;
  "4": DaySchedule;
  "5": DaySchedule;
  "6": DaySchedule;
};

type CourseData = {
  name: string;
  abbreviation: string | null;
} & {
  [K in keyof FormData]: DaySchedule;
};

export default function EditCourseTimes({
  course,
  setModalOpen,
  newData,
  setNewData
}: {
  course: TCourse;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  newData: {
    name: string;
    abbreviation: string;
    0: boolean;
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
    5: boolean;
    6: boolean;
  };
  setNewData: Dispatch<
    SetStateAction<{
      name: string;
      abbreviation: string;
      0: boolean;
      1: boolean;
      2: boolean;
      3: boolean;
      4: boolean;
      5: boolean;
      6: boolean;
    } | null>
  >;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const selectedDays = useMemo(
    () =>
      Object.keys(newData).filter(
        (day) => newData[day as keyof typeof newData] === true
      ) as Array<keyof FormData>,
    [newData]
  );

  const updateMutation = useMutation({
    mutationFn: async (data: CourseData) => {
      const res = await fetch("/api/courses/", {
        method: "PATCH",
        body: JSON.stringify({
          ...data,
          id: course.id,
          timezone: dayjs.tz.guess()
        })
      });

      if (!res.ok) {
        throw new Error();
      }

      return data;
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(
        queryKeys.courses.all(),
        (old: TCourse[] | undefined) =>
          old?.map((c) => {
            if (c.id === course.id) {
              return {
                ...c,
                courseTimes: Object.keys(data)
                  .filter((key) => !Number.isNaN(Number.parseInt(key)))
                  .map((key) => ({
                    id:
                      course.courseTimes.find(
                        (time) => time.dayOfWeek === Number.parseInt(key)
                      )?.id || "",
                    dayOfWeek: Number.parseInt(key),
                    startTime:
                      data[key as keyof FormData]?.startTime || undefined,
                    endTime: data[key as keyof FormData]?.endTime || undefined,
                    room: data[key as keyof FormData]?.room || undefined
                  }))
              };
            }
            return c;
          })
      );

      toast({
        type: "foreground",
        title: "Course updated",
        description: `${data.name} has been updated successfully.`
      });

      setModalOpen(false);
    },
    onError: () => {
      toast({
        type: "foreground",
        title: "An error occurred",
        description: "An error occurred while updating the course."
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.all()
      });
    }
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: (() => {
      const courseTimesByDay:
        | {
            [key: string]: DaySchedule;
          }
        | undefined = {};

      for (let day = 0; day <= 6; day++) {
        const time = course.courseTimes.find(
          (time) => time.dayOfWeek === day
        ) || {
          startTime: undefined,
          endTime: undefined,
          room: undefined
        };

        courseTimesByDay[day] = {
          startTime: time.startTime || undefined,
          endTime: time.endTime || undefined,
          room: time.room || undefined
        };
      }

      return courseTimesByDay;
    })()
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        selectedDays.includes(key as keyof FormData)
      )
    ) as {
      [K in keyof FormData]: DaySchedule;
    };

    if (Object.keys(filteredData).length === 0 || !newData.name) {
      const errorMessage = [];

      if (Object.keys(filteredData).length === 0) {
        errorMessage.push("at least one day is required");
      }

      if (!newData.name) {
        errorMessage.push("name is required");
      }

      setError("root", {
        type: "manual",
        message: errorMessage.join(", ").replace(/^\w/, (c) => c.toUpperCase())
      });

      return;
    }

    updateMutation.mutate({
      ...filteredData,
      abbreviation: newData.abbreviation,
      name: newData.name
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div className="flex flex-col gap-8">
        {selectedDays.map((day) => (
          <div key={day} className="flex flex-col gap-3">
            <h2 className="text-text-md font-semibold">{days[day]?.long}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${day}.startTime`} className={labelStyles()}>
                  Start time
                </label>
                <input
                  id={`${day}.startTime`}
                  type="time"
                  {...register(`${day}.startTime`)}
                  className={inputStyles(
                    {
                      size: "sm",
                      error: Boolean(errors[day]?.startTime)
                    },
                    "h-[2.75rem]"
                  )}
                />
                {errors[day]?.startTime ? (
                  <p className={errorStyles}>{errors[day].startTime.message}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${day}.endTime`} className={labelStyles()}>
                  End time
                </label>
                <input
                  id={`${day}.endTime`}
                  type="time"
                  {...register(`${day}.endTime`)}
                  className={inputStyles(
                    {
                      size: "sm",
                      error: Boolean(errors[day]?.endTime)
                    },
                    "h-[2.75rem]"
                  )}
                />
                {errors[day]?.endTime ? (
                  <p className={errorStyles}>{errors[day].endTime.message}</p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${day}.room`} className={labelStyles()}>
                Room
              </label>
              <input
                id={`${day}.room`}
                type="text"
                {...register(`${day}.room`)}
                className={inputStyles({
                  size: "sm",
                  error: Boolean(errors[day]?.room)
                })}
              />
              {errors[day]?.room ? (
                <p className={errorStyles}>{errors[day].room.message}</p>
              ) : null}
            </div>
          </div>
        ))}
        {errors.root ? (
          <p className={errorStyles}>{errors.root.message}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          className={buttonStyles({
            size: "md",
            variant: "secondary"
          })}
          onClick={() => {
            setNewData(null);
          }}
        >
          Return
        </button>
        <button
          className={buttonStyles({
            size: "md",
            variant: "primary"
          })}
          disabled={updateMutation.isPending}
        >
          Save
        </button>
      </div>
    </form>
  );
}
