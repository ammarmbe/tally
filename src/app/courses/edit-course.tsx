import buttonStyles from "@/utils/styles/button";
import { TCourse } from "@/utils/types";
import { useForm, SubmitHandler } from "react-hook-form";
import type { FormData } from "@/utils/types";
import Modal from "@/components/modal";
import PatchCourse from "@/components/patch-course";
import { toast } from "@/components/toast/use-toast";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { Pencil } from "lucide-react";
import router from "next/router";

dayjs.extend(timezone);

export default function EditCourse({ course }: { course: TCourse }) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      id: course.id,
      name: course.name,
      abbreviation: course.abbreviation || "",
      times: course.courseTimes.map((time) => ({
        day: Number(time.dayOfWeek),
        startTime: time.startTime ?? "",
        endTime: time.endTime ?? "",
        room: time.room ?? ""
      }))
    }
  });

  const addMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/courses", {
        method: "PATCH",
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
    <Modal
      trigger={
        <button
          className={buttonStyles(
            {
              size: "sm",
              variant: "tertiary",
              dropdown: true
            },
            "justify-start"
          )}
          disabled={addMutation.isPending}
        >
          <Pencil size={16} /> Edit
        </button>
      }
      title="Edit course"
      className="md:max-w-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <PatchCourse
        register={register}
        setValue={setValue}
        watch={watch}
        errors={errors}
      />
    </Modal>
  );
}
