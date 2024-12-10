"use client";

import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "./style.css";
import dayjs from "dayjs";
import { useRouter } from "next-nprogress-bar";

const localizer = dayjsLocalizer(dayjs);

export default function Page() {
  const router = useRouter();

  return (
    <div
      className="h-[min(80dvh,40rem)] sm:p-8"
    >
      <Calendar
        selectable
        localizer={localizer}
        view="month"
        onSelectSlot={(slotInfo) => {
          const day = dayjs(slotInfo.start).format("YYYY-MM-DD");

          router.push(`/date/${day}`);
        }}
        longPressThreshold={0}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
}
