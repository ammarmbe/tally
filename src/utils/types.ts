import { $Enums } from "@prisma/client";

export type TCourseTime = {
  attended: number;
  missed: number;
  cancelled: number;
  id: string;
  dayOfWeek: number;
  room: string | null;
  status: $Enums.Status | "";
  startTime: string | null;
  endTime: string | null;
  attendance: {
    label: string;
    percentage: number;
  };
  course: {
    id: string;
    name: string;
    abbreviation: string;
  };
};

export type TCourse = {
  attended: number;
  missed: number;
  cancelled: number;
  id: string;
  name: string;
  abbreviation: string;
  attendance: {
    label: string;
    percentage: number;
  };
  courseTimes: {
    id: string;
    dayOfWeek: number;
    startTime: string | null;
    endTime: string | null;
    room: string | null;
  }[];
};

export type TCourseHistory = {
  id: string;
  courseId: string;
  status: $Enums.Status | undefined;
  title: string;
  room: string | null;
  date: string;
  start: string;
  end: string;
};
