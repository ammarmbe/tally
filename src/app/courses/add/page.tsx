"use client";

import { days } from "@/utils/client";
import buttonStyles from "@/utils/styles/button";
import { errorStyles, inputStyles, labelStyles } from "@/utils/styles/input";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export default function Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
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
  }>();

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
    if (
      Object.keys(data).filter((key) => data[key as keyof typeof data]).length <
      2
    ) {
      setError("root", {
        type: "manual",
        message: "At least one day must be selected"
      });

      return;
    }

    router.push(
      `/courses/add/times?name=${data.name}&abbreviation=${data.abbreviation}&${Object.keys(
        data
      )
        .filter((key) => data[key as keyof typeof data])
        .filter((key) => key !== "name")
        .map((key) => `days=${key}`)
        .join("&")}`
    );
  };

  return (
    <>
      <h1 className="p-4 pb-0 text-display-xs font-semibold sm:p-8 sm:pb-0 md:text-display-sm">
        Add Course
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-fit flex-col gap-8 p-4 sm:p-8"
      >
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
            className={inputStyles({ size: "sm", error: Boolean(errors.name) })}
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
            {days.map((day) => (
              <Fragment key={day.value}>
                <label
                  htmlFor={day.value}
                  className={twMerge(
                    "flex h-fit cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 !text-text-sm font-semibold transition-all active:shadow-focus-ring-gray",
                    watch(day.value)
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
                />
              </Fragment>
            ))}
          </div>
        </div>
        {errors.root ? (
          <p className={errorStyles}>{errors.root.message}</p>
        ) : null}
        <button
          type="submit"
          className={buttonStyles(
            {
              size: "sm",
              variant: "primary"
            },
            "mt-3 w-fit self-end"
          )}
        >
          <ArrowRight size={16} /> Next
        </button>
      </form>
    </>
  );
}
