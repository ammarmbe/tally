import { useQuery } from "@tanstack/react-query";
import queryKeys from "./query-keys";
import { User } from "next-auth";
import dayjs from "dayjs";

export function useUser() {
  const { data } = useQuery({
    queryKey: queryKeys.user(),
    queryFn: async () => {
      const res = await fetch("/api/user");
      return res.json() as Promise<User | null>;
    }
  });

  return data;
}

export const days = [
  {
    long: "Sunday",
    label: "Sun",
    value: "0"
  },
  {
    long: "Monday",
    label: "Mon",
    value: "1"
  },
  {
    long: "Tuesday",
    label: "Tue",
    value: "2"
  },
  {
    long: "Wednesday",
    label: "Wed",
    value: "3"
  },
  {
    long: "Thursday",
    label: "Thu",
    value: "4"
  },
  {
    long: "Friday",
    label: "Fri",
    value: "5"
  },
  {
    long: "Saturday",
    label: "Sat",
    value: "6"
  }
] as const;

export const defaultDate = dayjs().format("YYYY-MM-DD ");

export function calculateNextClass(
  array: {
    id: string;
    dayOfWeek: number;
    startTime: string | null;
    endTime: string | null;
    room: string | null;
  }[]
) {
  const today = dayjs().day();

  const sorted = array.toSorted((a, b) => {
    const aDay = a.dayOfWeek >= today ? a.dayOfWeek : a.dayOfWeek + 7;
    const bDay = b.dayOfWeek >= today ? b.dayOfWeek : b.dayOfWeek + 7;

    return aDay - bDay;
  });

  if (
    sorted[0].dayOfWeek === today &&
    (sorted[0].startTime
      ? dayjs().isBefore(dayjs(defaultDate + sorted[0].startTime), "minute")
      : true)
  ) {
    return "today";
  }

  return [
    dayjs().day(sorted[0].dayOfWeek).format("dddd"),
    sorted[0].startTime
      ? dayjs(defaultDate + sorted[0].startTime).format("h:mm A")
      : undefined
  ].join(" ");
}

type TCourseTime = {
  id: string;
  dayOfWeek: number;
  startTime: string | null;
  endTime: string | null;
  room: string | null;
};

export const groupCourseTimes = (courseTimes: TCourseTime[]) => {
  return Object.values(
    courseTimes.reduce(
      (acc, courseTime) => {
        const key = `${courseTime.startTime}-${courseTime.endTime}-${courseTime.room}`;
        if (!acc[key]) {
          acc[key] = { ...courseTime, days: [] };
        }
        acc[key].days.push(courseTime.dayOfWeek);
        return acc;
      },
      {} as Record<string, TCourseTime & { days: number[] }>
    )
  );
};
