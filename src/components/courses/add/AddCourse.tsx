"use client";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
});

export default function AddCourse() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      days: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(`/courses/add/times?name=${values.name}&days=${values.days}`);
  }

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

    if (name?.length >= 1 || name?.length <= 128) {
      form.setValue("name", name);
    }

    if (days.split(",").filter((d) => allDays.includes(d)).length > 0) {
      form.setValue(
        "days",
        days.split(",").filter((d) => allDays.includes(d)),
      );
    }
  }, [pathname]);

  return (
    <section className="flex h-[calc(100dvh-4.5rem)] flex-col items-center justify-start">
      <div className="w-full max-w-lg">
        <CardHeader className="p-4">
          <CardTitle>Add a new course</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
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
              <Button type="submit" className="float-right">
                Next
              </Button>
            </form>
          </Form>
        </CardContent>
      </div>
    </section>
  );
}
