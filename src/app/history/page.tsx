"use client";

import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "./style.css";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import queryKeys from "@/utils/query-keys";
import { TCourseHistory } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {
  const router = useRouter();

  const localizer = dayjsLocalizer(dayjs);

  const [currentView, setCurrentView] = useState<
    "month" | "week" | "work_week" | "day" | "agenda"
  >("month");
  const [range, setRange] = useState<{ start: Date; end: Date }>({
    start: dayjs().startOf("month").startOf("week").toDate(),
    end: dayjs().endOf("month").endOf("week").toDate()
  });

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.courses.history(
      range?.start ?? null,
      range?.end ?? null
    ),
    queryFn: async () => {
      const res = await fetch(
        `/api/courses/history?start=${range?.start.toDateString()}&end=${range?.end.toDateString()}`
      );

      if (!res.ok) {
        throw new Error("An error occurred while fetching the data.");
      }

      const data = (await res.json()) as TCourseHistory[];

      return data.map((item) => ({
        ...item,
        start: dayjs(item.start).toDate(),
        end: dayjs(item.end).toDate(),
        date: dayjs(item.date).toDate()
      }));
    }
  });

  const handleViewChange = (view: typeof currentView) => {
    setCurrentView(view);
  };

  const handleRangeChange = (r: typeof range | Date[]) => {
    if (Array.isArray(r)) {
      setRange({ start: r[0], end: r[r.length - 1] });
    } else {
      setRange(r);
    }
  };

  return (
    <div
      className={`h-[min(80dvh,40rem)] p-4 sm:p-8 ${isLoading ? "pointer-events-none opacity-80" : ""}`}
    >
      <Calendar
        selectable
        localizer={localizer}
        events={data}
        view={currentView}
        onView={handleViewChange}
        date={
          currentView === "month"
            ? dayjs(range?.start).add(15, "day").toDate()
            : range?.start
        }
        onRangeChange={handleRangeChange}
        eventPropGetter={(event) => {
          if (event.attended === true) {
            return {
              className: "bg-brand-solid"
            };
          }

          if (event.attended === false) {
            return {
              className: "bg-error-solid"
            };
          }

          return {
            className: "bg-quaternary"
          };
        }}
        onSelectSlot={(slotInfo) => {
          const day = dayjs(slotInfo.start).format("YYYY-MM-DD");

          router.push(`/date/${day}`);
        }}
        onSelectEvent={(event) => {
          const day = dayjs(event.date).format("YYYY-MM-DD");

          router.push(`/date/${day}`);
        }}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
}
