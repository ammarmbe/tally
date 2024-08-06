import buttonStyles from "@/utils/styles/button";
import { days } from "@/utils/client";
import { labelStyles, inputStyles, errorStyles } from "@/utils/styles/input";
import { TCourse } from "@/utils/types";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import queryKeys from "@/utils/query-keys";
import { useToast } from "@/components/toast/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";

export default function EditCourse({
  course,
  setModalOpen,
  setNewData
}: {
  course: TCourse;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
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

  const [daysUpdated, setDaysUpdated] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; abbreviation: string }) => {
      const res = await fetch("/api/courses/", {
        method: "PATCH",
        body: JSON.stringify({ ...data, id: course.id })
      });

      if (!res.ok) {
        throw new Error("An error occurred while updating the course.");
      }

      return data;
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(
        queryKeys.courses.all(),
        (old: TCourse[] | undefined) =>
          old?.map((c) => {
            if (c.id === course.id) {
              return { ...c, ...data };
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
    control,
    watch,
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
      abbreviation: course.abbreviation,
      0: course.courseTimes.some((time) => time.dayOfWeek === 0),
      1: course.courseTimes.some((time) => time.dayOfWeek === 1),
      2: course.courseTimes.some((time) => time.dayOfWeek === 2),
      3: course.courseTimes.some((time) => time.dayOfWeek === 3),
      4: course.courseTimes.some((time) => time.dayOfWeek === 4),
      5: course.courseTimes.some((time) => time.dayOfWeek === 5),
      6: course.courseTimes.some((time) => time.dayOfWeek === 6)
    }
  });

  const formDays = useWatch({
    name: ["0", "1", "2", "3", "4", "5", "6"],
    control
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

    const days = Object.fromEntries(
      Array.from({ length: 7 }, (_, i) => [
        i.toString(),
        course.courseTimes.some((time) => time.dayOfWeek === i)
      ])
    );

    if (JSON.stringify(mappedFormDays) !== JSON.stringify(days)) {
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
    } else {
      updateMutation.mutate({
        name: data.name,
        abbreviation: data.abbreviation
      });
    }
  };

  useEffect(() => {
    const mappedFormDays = Object.fromEntries(
      Object.keys(formDays).map((key) => [
        key,
        formDays[key as keyof typeof formDays]
      ])
    );

    const days = Object.fromEntries(
      Array.from({ length: 7 }, (_, i) => [
        i.toString(),
        course.courseTimes.some((time) => time.dayOfWeek === i)
      ])
    );

    if (JSON.stringify(mappedFormDays) !== JSON.stringify(days)) {
      setDaysUpdated(true);
    } else {
      setDaysUpdated(false);
    }
  }, [formDays, course.courseTimes]);

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
          disabled={updateMutation.isPending}
        >
          {daysUpdated ? "Next" : "Save"}
        </button>
      </div>
    </form>
  );
}
