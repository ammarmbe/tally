import { auth } from "@/utils/auth";
import prisma from "@/utils/db";
import { calculatePercentage } from "@/utils/shared";
import dayjs from "dayjs";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const session = await auth();
  const { date } = await params;

  if (!session?.user) {
    return new Response(null, { status: 401 });
  }

  const courses = await prisma.courseTime.findMany({
    where: {
      course: {
        userId: session.user.id,
        deletedAt: null
      },
      dayOfWeek: dayjs(date).day()
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
          abbreviation: true,
          courseAttendances: {
            where: {
              date: date
            },
            select: {
              attended: true
            }
          }
        }
      }
    }
  });

  const attendances = await prisma.courseAttendance.groupBy({
    by: ["courseId", "attended"],
    _count: {
      attended: true
    },
    where: {
      courseId: {
        in: courses.map((c) => c.course.id)
      }
    }
  });

  return new Response(
    JSON.stringify(
      courses.map((course) => {
        const total_attended =
          attendances.find(
            (a) => a.attended === true && a.courseId === course.course.id
          )?._count.attended || 0;

        const total_missed =
          attendances.find(
            (a) => a.attended === false && a.courseId === course.course.id
          )?._count.attended || 0;

        const attendance = calculatePercentage(
          total_attended,
          total_missed,
          session.user?.attendanceAsPercentage ?? undefined
        );

        return {
          ...course,
          attended: course.course.courseAttendances[0]?.attended,
          attendance,
          total_attended,
          total_missed
        };
      })
    )
  );
}
