"use client";

import { useToast } from "@/components/toast/use-toast";
import { days } from "@/utils/client";
import buttonStyles from "@/utils/styles/button";
import { errorStyles, inputStyles, labelStyles } from "@/utils/styles/input";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

type DaySchedule = {
  startTime: string;
  endTime: string;
  room: string;
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

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const selectedDays = useMemo(
    () => searchParams.getAll("days") as Array<keyof FormData>,
    [searchParams]
  );

  const name = useMemo(() => searchParams.get("name"), [searchParams]);

  const addMutation = useMutation({
    mutationFn: async (data: CourseData) => {
      const res = await fetch(`/api/courses`, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          timezone: dayjs.tz.guess()
        })
      });

      if (!res.ok) {
        throw new Error();
      }
    },
    onSuccess: async () => {
      router.push("/courses");
    },
    onError: () => {
      toast({
        type: "foreground",
        title: "An error occurred",
        description: "An error occurred while adding the course."
      });
    }
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        selectedDays.includes(key as keyof FormData)
      )
    ) as {
      [K in keyof FormData]: DaySchedule;
    };

    if (Object.keys(filteredData).length === 0 || !name) {
      const errorMessage = [];

      if (Object.keys(filteredData).length === 0) {
        errorMessage.push("at least one day is required");
      }

      if (!name) {
        errorMessage.push("name is required");
      }

      setError("root", {
        type: "manual",
        message: errorMessage.join(", ").replace(/^\w/, (c) => c.toUpperCase())
      });

      return;
    }

    const abbreviation = searchParams.get("abbreviation");

    addMutation.mutate({ ...filteredData, abbreviation, name });
  };

  useEffect(() => {
    if (selectedDays.length === 0 || !name) {
      router.push("/courses/add");
    }
  }, [name, router, selectedDays]);

  return (
    <>
      <h1 className="p-4 pb-0 text-display-xs font-semibold sm:p-8 sm:pb-0 md:text-display-sm">
        Add Course
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-w-md flex-col gap-5 p-4 sm:p-8"
      >
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
                    className={inputStyles({
                      size: "sm",
                      error: Boolean(errors[day]?.startTime)
                    })}
                  />
                  {errors[day]?.startTime ? (
                    <p className={errorStyles}>
                      {errors[day].startTime.message}
                    </p>
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
                    className={inputStyles({
                      size: "sm",
                      error: Boolean(errors[day]?.endTime)
                    })}
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
        </div>
        {errors.root ? (
          <p className={errorStyles}>{errors.root.message}</p>
        ) : null}
        <div className="mt-3 flex gap-3 self-end">
          <Link
            href="/courses/add"
            className={buttonStyles({
              size: "sm",
              variant: "secondary"
            })}
          >
            <ArrowLeft size={16} /> Return
          </Link>
          <button
            type="submit"
            className={buttonStyles({
              size: "sm",
              variant: "primary"
            })}
            disabled={addMutation.isPending}
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </form>
    </>
  );
}
