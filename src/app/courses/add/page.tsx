"use client";

import { useRouter } from "next-nprogress-bar";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/toast/use-toast";
import type { FormData } from "@/utils/types";
import PatchCourse from "@/components/patch-course";
import buttonStyles from "@/utils/styles/button";
import { Check } from "lucide-react";

dayjs.extend(timezone);

export default function Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      abbreviation: "",
      times: [
        {
          day: 0,
          startTime: "",
          endTime: "",
          room: ""
        }
      ]
    }
  });

  const addMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/courses", {
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

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data.times);

    if (data.times.length < 1) {
      setError("root", {
        type: "manual",
        message: "At least one day is required"
      });

      return;
    }

    addMutation.mutate(data);
  };

  return (
    <>
      <h1 className="p-4 pb-0 text-display-xs font-semibold sm:p-8 sm:pb-0 md:text-display-sm">
        Add Course
      </h1>
      <div className="flex w-full max-w-md p-4 sm:p-8">
        <PatchCourse
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          saveButton={
            <button
              type="submit"
              className={buttonStyles(
                {
                  size: "sm",
                  variant: "primary"
                },
                "mt-3 w-fit self-end"
              )}
              disabled={addMutation.isPending}
            >
              <Check size={16} /> Save
            </button>
          }
        />
      </div>
    </>
  );
}
