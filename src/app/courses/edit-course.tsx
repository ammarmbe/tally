import buttonStyles from "@/utils/styles/button";
import { days as allDays } from "@/utils/client";
import { labelStyles, inputStyles, errorStyles } from "@/utils/styles/input";
import { TCourse } from "@/utils/types";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { DialogClose } from "@radix-ui/react-dialog";

export default function EditCourse({
  course,
  setNewData
}: {
  course: TCourse;
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
  const [selectedDays, setSelectedDays] = useState<string[]>(
    course.courseTimes.map((time) => time.dayOfWeek.toString())
  );

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{
    name: string;
    abbreviation: string;
    "0": boolean;
    "1": boolean;
    "2": boolean;
    "3": boolean;
    "4": boolean;
    "5": boolean;
    "6": boolean;
  }>({
    defaultValues: {
      name: course.name,
      abbreviation: course.abbreviation || undefined,
      0: course.courseTimes.some((time) => time.dayOfWeek === 0),
      1: course.courseTimes.some((time) => time.dayOfWeek === 1),
      2: course.courseTimes.some((time) => time.dayOfWeek === 2),
      3: course.courseTimes.some((time) => time.dayOfWeek === 3),
      4: course.courseTimes.some((time) => time.dayOfWeek === 4),
      5: course.courseTimes.some((time) => time.dayOfWeek === 5),
      6: course.courseTimes.some((time) => time.dayOfWeek === 6)
    }
  });

  const onSubmit: SubmitHandler<{
    name: string;
    abbreviation: string;
    "0": boolean;
    "1": boolean;
    "2": boolean;
    "3": boolean;
    "4": boolean;
    "5": boolean;
    "6": boolean;
  }> = (data) => {
    const mappedFormDays = Object.fromEntries(
      Object.keys({
        0: data["0"],
        1: data["1"],
        2: data["2"],
        3: data["3"],
        4: data["4"],
        5: data["5"],
        6: data["6"]
      }).map((key) => [key, data[key as keyof typeof data]])
    );

    setNewData({
      name: data.name,
      abbreviation: data.abbreviation,
      ...(mappedFormDays as {
        0: boolean;
        1: boolean;
        2: boolean;
        3: boolean;
        4: boolean;
        5: boolean;
        6: boolean;
      })
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="courseName"
            className={labelStyles({ required: true })}
          >
            Course name
          </label>
          <input
            type="text"
            id="courseName"
            className={inputStyles({
              size: "sm",
              error: Boolean(errors.name)
            })}
            {...register("name", {
              required: {
                value: true,
                message: "Course name is required"
              },
              maxLength: {
                value: 64,
                message: "Course name must be at most 64 characters"
              }
            })}
          />
          {errors.name && <p className={errorStyles}>{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="courseAbbreviation" className={labelStyles()}>
            Abbreviation (short name)
          </label>
          <input
            type="text"
            id="courseAbbreviation"
            className={inputStyles({
              size: "sm",
              error: Boolean(errors.abbreviation)
            })}
            {...register("abbreviation", {
              maxLength: {
                value: 12,
                message: "Abbreviation must be at most 12 characters"
              }
            })}
          />
          {errors.abbreviation && (
            <p className={errorStyles}>{errors.abbreviation.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <p className={labelStyles({ required: true })}>Days</p>
          <div className="flex flex-wrap gap-2">
            {allDays.map((day) => (
              <Fragment key={day.value}>
                <label
                  htmlFor={day.value}
                  className={twMerge(
                    "flex h-fit cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 !text-text-sm font-semibold transition-all active:shadow-focus-ring-gray",
                    selectedDays.includes(day.value)
                      ? "border-transparent bg-gray-900 text-gray-100 hover:bg-gray-700 active:bg-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 dark:active:bg-gray-100"
                      : "hover:bg-secondary text-secondary hover:text-primary active:bg-primary bg-primary hover:border-primary"
                  )}
                >
                  {day.label}
                </label>
                <input
                  type="checkbox"
                  id={day.value}
                  hidden
                  {...register(day.value)}
                  onClick={() => {
                    setSelectedDays((prev) =>
                      prev.includes(day.value)
                        ? prev.filter((d) => d !== day.value)
                        : [...prev, day.value]
                    );
                  }}
                />
              </Fragment>
            ))}
          </div>
        </div>
        {errors.root ? (
          <p className={errorStyles}>{errors.root.message}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DialogClose asChild>
          <button
            className={buttonStyles({
              size: "md",
              variant: "secondary"
            })}
          >
            Cancel
          </button>
        </DialogClose>
        <button
          className={buttonStyles({
            size: "md",
            variant: "primary"
          })}
        >
          Next
        </button>
      </div>
    </form>
  );
}
