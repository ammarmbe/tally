import { auth } from "@/utils/auth";
import prisma from "@/utils/db";
import dayjs from "dayjs";
import { customAlphabet } from "nanoid";
import * as v from "valibot";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 12);

const schema = v.object({
  attended: v.boolean(),
  date: v.string(),
  courseId: v.string()
});

export async function POST(req: Request) {
  const {
    attended,
    date,
    courseId
  }: {
    attended: boolean;
    date: string;
    courseId: string;
  } = await req.json();
  const session = await auth();

  try {
    v.parse(schema, { attended, date, courseId });
  } catch (error) {
    return new Response(null, { status: 400 });
  }

  if (!session?.user) {
    return new Response(null, { status: 401 });
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      userId: session.user.id,
      deletedAt: null
    },
    select: {
      id: true,
      courseTimes: {
        where: {
          dayOfWeek: dayjs(date).day()
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

  if (attendance && attendance.attended === attended) {
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
        attended,
        date,
        startTime: course.courseTimes[0]?.startTime,
        endTime: course.courseTimes[0]?.endTime,
        room: course.courseTimes[0]?.room,
        courseId: course.id,
        id: nanoid()
      },
      update: {
        attended
      }
    });
  }

  return new Response("OK");
}
