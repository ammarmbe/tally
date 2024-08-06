import { auth } from "@/utils/auth";
import prisma from "@/utils/db";
import dayjs from "dayjs";

const getDatesForDayOfWeek = (start: Date, end: Date, dayOfWeek: number) => {
  const dates = [];
  const current = new Date(start);

  // Adjust the start date to the first occurrence of the dayOfWeek
  current.setDate(current.getDate() + ((dayOfWeek - current.getDay() + 7) % 7));

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 7); // Move to the next week
  }

  return dates;
};

export async function GET(req: Request) {
  const session = await auth();

  const { searchParams } = new URL(req.url);

  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  if (!session?.user) {
    return new Response(null, { status: 401 });
  }

  if (!startDate || !endDate) {
    return new Response(null, { status: 400 });
  }

  const courseTimes = await prisma.courseTime.findMany({
    where: {
      course: {
        userId: session.user.id,
        deletedAt: null
      }
    },
    select: {
      id: true,
      dayOfWeek: true,
      startTime: true,
      room: true,
      endTime: true,
      course: {
        select: {
          id: true,
          name: true,
          abbreviation: true
        }
      }
    }
  });

  const attendances = await prisma.courseAttendance.findMany({
    where: {
      course: {
        userId: session.user.id,
        deletedAt: null
      }
    },
    select: {
      id: true,
      status: true,
      date: true,
      startTime: true,
      endTime: true,
      room: true,
      course: {
        select: {
          id: true,
          name: true,
          abbreviation: true
        }
      }
    }
  });

  const start = dayjs(startDate).toDate();
  const end = dayjs(endDate).toDate();

  const mappedCourseTimes = courseTimes
    .map((courseTime) => {
      const dates = getDatesForDayOfWeek(start, end, courseTime.dayOfWeek);

      return dates.map((date) => ({
        id: courseTime.id,
        courseId: courseTime.course.id,
        title: courseTime.course.abbreviation || courseTime.course.name,
        room: courseTime.room,
        status: undefined,
        date: dayjs(date).toDate(),
        start: dayjs(
          dayjs(date).format("YYYY-MM-DD ") + courseTime.startTime
        ).toDate(),
        end: dayjs(
          dayjs(date).format("YYYY-MM-DD ") + courseTime.endTime
        ).toDate()
      }));
    })
    .flat();

  const mappedAttendances = attendances.map((attendance) => ({
    id: attendance.id,
    courseId: attendance.course.id,
    status: attendance.status,
    title: attendance.course.abbreviation || attendance.course.name,
    room: attendance.room,
    date: dayjs(attendance.date).toDate(),
    start: dayjs(
      dayjs(attendance.date).format("YYYY-MM-DD ") + attendance.startTime
    ).toDate(),
    end: dayjs(
      dayjs(attendance.date).format("YYYY-MM-DD ") + attendance.endTime
    ).toDate()
  }));

  const attendanceKeys = new Set(
    mappedAttendances.map(
      (attendance) => `${attendance.date.getDate()}-${attendance.courseId}`
    )
  );

  // Filter mappedCourseTimes to exclude entries with corresponding attendance
  const filteredCourseTimes = mappedCourseTimes.filter(
    (courseTime) =>
      !attendanceKeys.has(`${courseTime.date.getDate()}-${courseTime.courseId}`)
  );

  return new Response(
    JSON.stringify([filteredCourseTimes, mappedAttendances].flat())
  );
}
