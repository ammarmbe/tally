import { $Enums } from "@prisma/client";

export type TCourseTime = {
  attended: number;
  missed: number;
  cancelled: number;
  id: string;
  dayOfWeek: number;
  room: string;
  status: $Enums.Status | "";
  startTime: Date | null;
  endTime: Date | null;
  course: {
    id: string;
    title: string;
  };
};
