import dayjs from "dayjs";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { timeStringToFloat } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";

var days = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7,
};

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Course name is required",
    })
    .max(128, {
      message: "Course name is too long",
    }),
  days: z
    .array(z.string(), {
      required_error: "Select at least one day",
    })
    .min(1, {
      message: "Select at least one day",
    }),
  times: z.object({
    sunday: z
      .object({
        start: z.string(),
        end: z.string(),
        room: z.string(),
      })
      .refine(
        (v) =>
          v.start && v.end
            ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
            : true,
        {
          message: "Start time must be before end time",
        },
      )
      .optional(),
    monday: z
      .object({
        start: z.string(),
        end: z.string(),
        room: z.string(),
      })
      .refine(
        (v) =>
          v.start && v.end
            ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
            : true,
        {
          message: "Start time must be before end time",
        },
      )
      .optional(),
    tuesday: z
      .object({
        start: z.string(),
        end: z.string(),
        room: z.string(),
      })
      .refine(
        (v) =>
          v.start && v.end
            ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
            : true,
        {
          message: "Start time must be before end time",
        },
      )
      .optional(),
    wednesday: z
      .object({
        start: z.string(),
        end: z.string(),
        room: z.string(),
      })
      .refine(
        (v) =>
          v.start && v.end
            ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
            : true,
        {
          message: "Start time must be before end time",
        },
      )
      .optional(),
    thursday: z
      .object({
        start: z.string(),
        end: z.string(),
        room: z.string(),
      })
      .refine(
        (v) =>
          v.start && v.end
            ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
            : true,
        {
          message: "Start time must be before end time",
        },
      )
      .optional(),
    friday: z
      .object({
        start: z.string(),
        end: z.string(),
        room: z.string(),
      })
      .refine(
        (v) =>
          v.start && v.end
            ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
            : true,
        {
          message: "Start time must be before end time",
        },
      )
      .optional(),
    saturday: z
      .object({
        start: z.string(),
        end: z.string(),
        room: z.string(),
      })
      .refine(
        (v) =>
          v.start && v.end
            ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
            : true,
        {
          message: "Start time must be before end time",
        },
      )
      .optional(),
  }),
});

export default function EditCoursesCourse({
  course,
}: {
  course: {
    course_name: string;
    course_id: string;
    attended: string;
    missed: string;
    cancelled: string;
    times: string[][];
  };
}) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: course.course_name,
      days: course.times.map((time) => time[0]),
      times: course.times.reduce(
        (acc, time) => {
          acc[time[0]] = {
            start: time[1] || "",
            end: time[2] || "",
            room: time[3] || "",
          };

          return acc;
        },
        {} as Record<string, { start: string; end: string; room: string }>,
      ),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate({
      id: course.course_id,
      name: values.name,
      days: values.days,
      times: {
        sunday: {
          start: values.times.sunday?.start,
          end: values.times.sunday?.end,
          room: values.times.sunday?.room,
        },
        monday: {
          start: values.times.monday?.start,
          end: values.times.monday?.end,
          room: values.times.monday?.room,
        },
        tuesday: {
          start: values.times.tuesday?.start,
          end: values.times.tuesday?.end,
          room: values.times.tuesday?.room,
        },
        wednesday: {
          start: values.times.wednesday?.start,
          end: values.times.wednesday?.end,
          room: values.times.wednesday?.room,
        },
        thursday: {
          start: values.times.thursday?.start,
          end: values.times.thursday?.end,
          room: values.times.thursday?.room,
        },
        friday: {
          start: values.times.friday?.start,
          end: values.times.friday?.end,
          room: values.times.friday?.room,
        },
        saturday: {
          start: values.times.saturday?.start,
          end: values.times.saturday?.end,
          room: values.times.saturday?.room,
        },
      },
    });
  }

  const updateMutation = useMutation({
    mutationKey: ["update-course", course.course_id],
    mutationFn: async (data: {
      id: string;
      name: string;
      days: string[];
      times: {
        sunday: { start?: string; end?: string; room?: string };
        monday: { start?: string; end?: string; room?: string };
        tuesday: { start?: string; end?: string; room?: string };
        wednesday: { start?: string; end?: string; room?: string };
        thursday: { start?: string; end?: string; room?: string };
        friday: { start?: string; end?: string; room?: string };
        saturday: { start?: string; end?: string; room?: string };
      };
    }) => {
      await fetch("/api/courses", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onMutate: async (data) => {
      queryClient.setQueryData(
        ["courses"],
        (
          old:
            | {
                course_name: string;
                course_id: string;
                attended: string;
                missed: string;
                cancelled: string;
                times: string[][];
              }[]
            | undefined,
        ) => {
          if (!old) return old;

          return old.map((course) => {
            if (course.course_id === data.id) {
              return {
                ...course,
                course_name: data.name,
                times: Object.entries(data.times)
                  .filter(([day]) => data.days.includes(day))
                  .map(([day, time]) => [day, time.start, time.end, time.room]),
              };
            }

            return course;
          });
        },
      );
    },
    onSuccess: () => {
      setDialogOpen(false);
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-course", course.course_id],
    mutationFn: async () => {
      await fetch("/api/courses", {
        method: "DELETE",
        body: JSON.stringify({
          id: course.course_id,
        }),
      });
    },
    onMutate: async () => {
      queryClient.setQueryData(
        ["courses"],
        (
          old:
            | {
                course_name: string;
                course_id: string;
                attended: string;
                missed: string;
                cancelled: string;
                times: string[][];
              }[]
            | undefined,
        ) => {
          if (!old) return old;

          return old.filter((c) => c.course_id !== course.course_id);
        },
      );
    },
    onSuccess: () => {
      setDeleteOpen(false);
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });

  return (
    <Card
      key={course.course_id}
      className="h-fit max-w-[calc(100vw-2rem)] sm:max-w-xs"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-10">
          <div className="flex min-w-0 flex-grow flex-col gap-1.5">
            <CardTitle className="max-w-sm truncate leading-normal">
              {course.course_name}
            </CardTitle>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="icon">
                <Pencil className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Edit {course.course_name}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 text-start"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor={field.name}>Course name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Accounting"
                            {...field}
                            autoComplete="name"
                            className="leading-normal"
                            id={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel asChild>
                          <p>Select days</p>
                        </FormLabel>
                        <ToggleGroup
                          type="multiple"
                          className="flex-wrap justify-start"
                          onValueChange={(v) => field.onChange(v)}
                          {...field}
                        >
                          <ToggleGroupItem
                            variant="outline"
                            value="sunday"
                            className="hover:border-[#828487]/20 hover:bg-[#828487]/5 active:bg-[#828487]/20 data-[state=on]:border-[#828487]/20 data-[state=on]:bg-[#828487]/20 data-[state=on]:active:bg-[#828487]/30"
                          >
                            Sun
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            variant="outline"
                            value="monday"
                            className="hover:border-[#828487]/20 hover:bg-[#828487]/5 active:bg-[#828487]/20 data-[state=on]:border-[#828487]/20 data-[state=on]:bg-[#828487]/20 data-[state=on]:active:bg-[#828487]/30"
                          >
                            Mon
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            variant="outline"
                            value="tuesday"
                            className="hover:border-[#828487]/20 hover:bg-[#828487]/5 active:bg-[#828487]/20 data-[state=on]:border-[#828487]/20 data-[state=on]:bg-[#828487]/20 data-[state=on]:active:bg-[#828487]/30"
                          >
                            Tue
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            variant="outline"
                            value="wednesday"
                            className="hover:border-[#828487]/20 hover:bg-[#828487]/5 active:bg-[#828487]/20 data-[state=on]:border-[#828487]/20 data-[state=on]:bg-[#828487]/20 data-[state=on]:active:bg-[#828487]/30"
                          >
                            Wed
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            variant="outline"
                            value="thursday"
                            className="hover:border-[#828487]/20 hover:bg-[#828487]/5 active:bg-[#828487]/20 data-[state=on]:border-[#828487]/20 data-[state=on]:bg-[#828487]/20 data-[state=on]:active:bg-[#828487]/30"
                          >
                            Thu
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            variant="outline"
                            value="friday"
                            className="hover:border-[#828487]/20 hover:bg-[#828487]/5 active:bg-[#828487]/20 data-[state=on]:border-[#828487]/20 data-[state=on]:bg-[#828487]/20 data-[state=on]:active:bg-[#828487]/30"
                          >
                            Fri
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            variant="outline"
                            value="saturday"
                            className="hover:border-[#828487]/20 hover:bg-[#828487]/5 active:bg-[#828487]/20 data-[state=on]:border-[#828487]/20 data-[state=on]:bg-[#828487]/20 data-[state=on]:active:bg-[#828487]/30"
                          >
                            Sat
                          </ToggleGroupItem>
                        </ToggleGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form
                    .watch("days")
                    .sort(
                      (a, b) =>
                        days[
                          a as
                            | "sunday"
                            | "monday"
                            | "tuesday"
                            | "wednesday"
                            | "thursday"
                            | "friday"
                            | "saturday"
                        ] -
                        days[
                          b as
                            | "sunday"
                            | "monday"
                            | "tuesday"
                            | "wednesday"
                            | "thursday"
                            | "friday"
                            | "saturday"
                        ],
                    )
                    .map((day) => (
                      <FormField
                        key={day}
                        control={form.control}
                        // @ts-ignore
                        name={`times.${
                          day as
                            | "sunday"
                            | "monday"
                            | "tuesday"
                            | "wednesday"
                            | "thursday"
                            | "friday"
                            | "saturday"
                        }.root`}
                        render={() => (
                          <FormItem>
                            <FormLabel asChild>
                              <p className="capitalize">{day}</p>
                            </FormLabel>
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col gap-2">
                                <FormLabel>From</FormLabel>
                                <FormField
                                  control={form.control}
                                  name={`times.${day as "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"}.start`}
                                  render={({ field }) => (
                                    <FormControl>
                                      <Input
                                        type="time"
                                        autoComplete="off"
                                        className="leading-normal"
                                        id={`${field.name}-start`}
                                        {...field}
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <FormLabel>To</FormLabel>
                                <FormField
                                  control={form.control}
                                  name={`times.${day as "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"}.end`}
                                  render={({ field }) => (
                                    <FormControl>
                                      <Input
                                        type="time"
                                        autoComplete="off"
                                        className="leading-normal"
                                        id={`${field.name}-end`}
                                        {...field}
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <FormLabel>Room</FormLabel>
                                <FormField
                                  control={form.control}
                                  name={`times.${day as "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"}.room`}
                                  render={({ field }) => (
                                    <FormControl>
                                      <Input
                                        type="text"
                                        autoComplete="off"
                                        className="leading-normal"
                                        id={`${field.name}-room`}
                                        {...field}
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}

                  <DialogFooter className="!mt-4 flex flex-col-reverse gap-y-2 sm:flex-row sm:justify-between sm:space-x-2">
                    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          className="self-left"
                          type="button"
                        >
                          Delete Course
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone.{" "}
                            <span className="font-medium">
                              This will permanently delete {course.course_name}.
                            </span>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="secondary">
                            <DialogClose>Cancel</DialogClose>
                          </Button>
                          <Button
                            variant="destructive"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                              deleteMutation.mutate();
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="flex flex-col-reverse gap-y-2 sm:flex-row sm:justify-end sm:space-x-2">
                      <DialogClose asChild>
                        <Button variant="secondary" type="button">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={updateMutation.isPending} type="submit">
                        Save
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {course.times.every((time) => time[1] === null && time[2] === null) ? (
          <>
            <p className="mb-1 font-medium">Days</p>
            <p className="capitalize">
              {course.times
                .map(
                  (time) =>
                    `${time[0]?.slice(0, 3)}${time[3] ? ` (${time[3]})` : ""}`,
                )
                .join(", ")}
            </p>
          </>
        ) : (
          <>
            <p className="mb-1 font-medium">Times</p>
            <div className="flex flex-col gap-2">
              {course.times
                .sort(
                  (a, b) =>
                    days[
                      a[0] as
                        | "sunday"
                        | "monday"
                        | "tuesday"
                        | "wednesday"
                        | "thursday"
                        | "friday"
                        | "saturday"
                    ] -
                    days[
                      b[0] as
                        | "sunday"
                        | "monday"
                        | "tuesday"
                        | "wednesday"
                        | "thursday"
                        | "friday"
                        | "saturday"
                    ],
                )
                .map((time) => (
                  <div key={time[0]} className="flex flex-col">
                    <p className="capitalize">
                      {time[0].slice(0, 3)}
                      {time[3] ? ` - Room ${time[3]}` : ""}
                    </p>
                    {time[1] && time[2] ? (
                      <p>
                        {dayjs(dayjs().format("YYYY-MM-DD ") + time[1]).format(
                          "hh:mm A",
                        )}{" "}
                        -{" "}
                        {dayjs(dayjs().format("YYYY-MM-DD ") + time[2]).format(
                          "hh:mm A",
                        )}
                      </p>
                    ) : null}
                  </div>
                ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
