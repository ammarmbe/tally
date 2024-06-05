"use client";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { timeStringToFloat } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

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
  sunday: z
    .object({
      start: z.string(),
      end: z.string(),
      room: z.string().optional(),
    })
    .refine(
      (v) =>
        v.start && v.end
          ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
          : true,
      {
        message: "Start time must be before end time",
      },
    ),
  monday: z
    .object({
      start: z.string(),
      end: z.string(),
      room: z.string().optional(),
    })
    .refine(
      (v) =>
        v.start && v.end
          ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
          : true,
      {
        message: "Start time must be before end time",
      },
    ),
  tuesday: z
    .object({
      start: z.string(),
      end: z.string(),
      room: z.string().optional(),
    })
    .refine(
      (v) =>
        v.start && v.end
          ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
          : true,
      {
        message: "Start time must be before end time",
      },
    ),
  wednesday: z
    .object({
      start: z.string(),
      end: z.string(),
      room: z.string().optional(),
    })
    .refine(
      (v) =>
        v.start && v.end
          ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
          : true,
      {
        message: "Start time must be before end time",
      },
    ),
  thursday: z
    .object({
      start: z.string(),
      end: z.string(),
      room: z.string().optional(),
    })
    .refine(
      (v) =>
        v.start && v.end
          ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
          : true,
      {
        message: "Start time must be before end time",
      },
    ),
  friday: z
    .object({
      start: z.string(),
      end: z.string(),
      room: z.string().optional(),
    })
    .refine(
      (v) =>
        v.start && v.end
          ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
          : true,
      {
        message: "Start time must be before end time",
      },
    ),
  saturday: z
    .object({
      start: z.string(),
      end: z.string(),
      room: z.string().optional(),
    })
    .refine(
      (v) =>
        v.start && v.end
          ? timeStringToFloat(v.start) < timeStringToFloat(v.end)
          : true,
      {
        message: "Start time must be before end time",
      },
    ),
});

export default function AddCourseTimes() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const name = searchParams.get("name") || "";
    const days = searchParams.get("days") || "";

    const allDays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    if (
      name?.length < 1 ||
      name?.length > 128 ||
      days.split(",").filter((d) => allDays.includes(d)).length < 0
    ) {
      router.push("/courses/add");
    }
  }, [pathname]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sunday: { start: "", end: "" },
      monday: { start: "", end: "" },
      tuesday: { start: "", end: "" },
      wednesday: { start: "", end: "" },
      thursday: { start: "", end: "" },
      friday: { start: "", end: "" },
      saturday: { start: "", end: "" },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const name = searchParams.get("name") || "";
    const days = searchParams.get("days") || "";

    const allDays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    if (
      name?.length < 1 ||
      name?.length > 128 ||
      days.split(",").filter((d) => allDays.includes(d)).length < 0
    ) {
      return;
    }

    createMutation.mutate({
      name,
      days: days.split(",").filter((d) => allDays.includes(d)),
      times: {
        sunday: {
          start: values.sunday.start,
          end: values.sunday.end,
          room: values.sunday.room,
        },
        monday: {
          start: values.monday.start,
          end: values.monday.end,
          room: values.monday.room,
        },
        tuesday: {
          start: values.tuesday.start,
          end: values.tuesday.end,
          room: values.tuesday.room,
        },
        wednesday: {
          start: values.wednesday.start,
          end: values.wednesday.end,
          room: values.wednesday.room,
        },
        thursday: {
          start: values.thursday.start,
          end: values.thursday.end,
          room: values.thursday.room,
        },
        friday: {
          start: values.friday.start,
          end: values.friday.end,
          room: values.friday.room,
        },
        saturday: {
          start: values.saturday.start,
          end: values.saturday.end,
          room: values.saturday.room,
        },
      },
    });

    router.push("/");
  }

  const createMutation = useMutation({
    mutationKey: ["create-course"],
    mutationFn: async (data: {
      name: string;
      days: string[];
      times: {
        sunday: { start: string; end: string; room?: string };
        monday: { start: string; end: string; room?: string };
        tuesday: { start: string; end: string; room?: string };
        wednesday: { start: string; end: string; room?: string };
        thursday: { start: string; end: string; room?: string };
        friday: { start: string; end: string; room?: string };
        saturday: { start: string; end: string; room?: string };
      };
    }) => {
      await fetch("/api/courses", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });

  return (
    <section className="flex h-[calc(100dvh-4.5rem)] flex-col items-center justify-start">
      <div className="w-full max-w-lg">
        <CardHeader className="p-4">
          <CardTitle>Select times</CardTitle>
          <CardDescription>
            All fields are optional. You can add more times later.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 text-start"
            >
              {searchParams
                .get("days")
                ?.split(",")
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
                    name={`${
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
                              name={`${day as "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"}.start`}
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
                              name={`${day as "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"}.end`}
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
                              name={`${day as "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"}.room`}
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
              <Button
                type="button"
                className="float-left !mb-6"
                variant="ghost"
                disabled={createMutation.isPending}
                asChild
              >
                <Link
                  href={`/courses/add?name=${searchParams.get("name")}&days=${searchParams.get("days")}`}
                >
                  Previous
                </Link>
              </Button>
              <Button
                type="submit"
                className="float-right"
                disabled={createMutation.isPending}
              >
                Finish
              </Button>
            </form>
          </Form>
        </CardContent>
      </div>
    </section>
  );
}
