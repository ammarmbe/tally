export type TCourseTime = {
  id: string;
  attended: boolean | null;
  total_attended: number;
  total_missed: number;
  dayOfWeek: number;
  startTime: string | null;
  endTime: string | null;
  room: string | null;
  attendance: {
    label: string;
    percentage: number;
  };
  course: {
    id: string;
    name: string;
    abbreviation: string | null;
    courseAttendances: {
      attended: boolean;
    }[];
  };
};

export type TCourse = {
  id: string;
  name: string;
  abbreviation: string | null;
  total_attended: number;
  total_missed: number;
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
  attended: boolean;
  title: string;
  room: string | null;
  date: string;
  start: string;
  end: string;
};

export type DaySchedule = {
  day: number;
  startTime: string;
  endTime: string;
  room: string;
};

export type FormData = {
  id?: string;
  name: string;
  abbreviation: string;
  times: DaySchedule[];
};
