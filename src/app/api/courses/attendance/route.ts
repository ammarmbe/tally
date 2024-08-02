import { auth } from "@/utils/auth";
import prisma from "@/utils/db";
import { $Enums } from "@prisma/client";
import { customAlphabet } from "nanoid";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 12);

export async function POST(req: Request) {
  let {
    status,
    date,
    courseId
  }: {
    status: $Enums.Status;
    date: string | Date;
    courseId: string;
  } = await req.json();
  const session = await auth();

  date = new Date(date);

  if (!session?.user) {
    return new Response(null, { status: 401 });
  }

  if (!["ATTENDED", "MISSED", "CANCELLED"].includes(status) || !date) {
    return new Response(null, { status: 400 });
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      userId: session.user.id
    },
    select: {
      id: true,
      courseTimes: {
        where: {
          dayOfWeek: date.getDay()
        },
        select: {
          startTime: true,
          endTime: true,
          room: true
        }
      }
    }
  });

  if (!course) {
    return new Response(null, { status: 404 });
  }

  const attendance = await prisma.courseAttendance.findUnique({
    where: {
      courseId_date: {
        courseId: course.id,
        date
      }
    }
  });

  if (attendance && attendance.status === status) {
    await prisma.courseAttendance.delete({
      where: {
        courseId_date: {
          courseId: course.id,
          date
        }
      }
    });
  } else {
    await prisma.courseAttendance.upsert({
      where: {
        courseId_date: {
          courseId: course.id,
          date
        }
      },
      create: {
        status,
        date,
        startTime: course.courseTimes[0]?.startTime,
        endTime: course.courseTimes[0]?.endTime,
        room: course.courseTimes[0]?.room,
        courseId: course.id,
        id: nanoid()
      },
      update: {
        status
      }
    });
  }

  return new Response("OK");
}
