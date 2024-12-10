"use client";

import buttonStyles from "@/utils/styles/button";
import { errorStyles, inputStyles, labelStyles } from "@/utils/styles/input";
import { X } from "lucide-react";
import { days } from "@/utils/client";
import type {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";
import type { FormData } from "@/utils/types";
import { ReactNode } from "react";

export default function PatchCourse({
  handleSubmit,
  onSubmit,
  register,
  errors,
  watch,
  setValue,
  saveButton
}: {
  handleSubmit?: UseFormHandleSubmit<FormData, undefined>;
  onSubmit?: SubmitHandler<FormData>;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  saveButton?: ReactNode;
}) {
  return (
    <form
      onSubmit={handleSubmit && onSubmit ? handleSubmit(onSubmit) : undefined}
      className="flex w-full flex-col gap-8"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="courseName" className={labelStyles({ required: true })}>
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
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="text-md font-medium">Times</p>
          <button
            className={buttonStyles({
              size: "sm",
              variant: "secondary"
            })}
            type="button"
            onClick={() => {
              setValue("times", [
                ...watch("times"),
                {
                  day: 0,
                  startTime: "",
                  endTime: "",
                  room: ""
                }
              ]);
            }}
          >
            Add time
          </button>
        </div>
        {watch("times").map((_, index) => (
          <div
            key={index}
            className="border-primary flex flex-col gap-5 rounded-2xl border p-5 shadow-xs"
          >
            <div className="flex flex-col gap-1.5">
              <div className="-mt-3 flex items-end justify-between">
                <label htmlFor={`times.${index}.day`} className={labelStyles()}>
                  Day
                </label>
                <button
                  className={buttonStyles(
                    {
                      size: "sm",
                      symmetrical: true,
                      variant: "tertiary"
                    },
                    "-mr-3 w-fit"
                  )}
                  type="button"
                  onClick={() => {
                    if (watch("times").length >= 2) {
                      setValue(
                        "times",
                        watch("times").filter((_, i) => i !== index)
                      );

                      console.log(watch("times"), index);
                    }
                  }}
                  disabled={watch("times").length < 2}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="relative flex h-fit w-full">
                <select
                  id={`times.${index}.day`}
                  {...register(`times.${index}.day`, { valueAsNumber: true })}
                  className={inputStyles(
                    {
                      size: "sm",
                      error: Boolean(errors.times?.[index]?.day)
                    },
                    "w-full"
                  )}
                >
                  {Object.values(days).map((day) => (
                    <option value={day.value} key={day.value}>
                      {day.long}
                    </option>
                  ))}
                </select>
                <div className="text-secondary absolute right-[9px] top-[9px] size-6">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {errors.times?.[index]?.day ? (
                  <p className={errorStyles}>
                    {errors.times?.[index].day.message}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`times.${index}.startTime`}
                  className={labelStyles()}
                >
                  Start time
                </label>
                <input
                  id={`times.${index}.startTime`}
                  type="time"
                  {...register(`times.${index}.startTime`)}
                  className={inputStyles(
                    {
                      size: "sm",
                      error: Boolean(errors.times?.[index]?.startTime)
                    },
                    "h-[2.75rem]"
                  )}
                />
                {errors.times?.[index]?.startTime ? (
                  <p className={errorStyles}>
                    {errors.times?.[index].startTime.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`times.${index}.endTime`}
                  className={labelStyles()}
                >
                  End time
                </label>
                <input
                  id={`times.${index}.endTime`}
                  type="time"
                  {...register(`times.${index}.endTime`)}
                  className={inputStyles(
                    {
                      size: "sm",
                      error: Boolean(errors.times?.[index]?.endTime)
                    },
                    "h-[2.75rem]"
                  )}
                />
                {errors.times?.[index]?.endTime ? (
                  <p className={errorStyles}>
                    {errors.times?.[index].endTime.message}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`times.${index}.room`} className={labelStyles()}>
                Room
              </label>
              <input
                id={`times.${index}.room`}
                type="text"
                {...register(`times.${index}.room`)}
                className={inputStyles({
                  size: "sm",
                  error: Boolean(errors.times?.[index]?.room)
                })}
              />

              {errors.times?.[index]?.room ? (
                <p className={errorStyles}>
                  {errors.times?.[index].room.message}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {errors.root ? (
        <p className={errorStyles}>{errors.root.message}</p>
      ) : null}
      {saveButton}
    </form>
  );
}
