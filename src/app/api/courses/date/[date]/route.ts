import { auth } from "@/utils/auth";
import prisma from "@/utils/db";
import { calculatePercentage } from "@/utils/shared";
import dayjs from "dayjs";

export async function GET(
  _: Request,
  { params }: { params: { date: string } }
) {
  const session = await auth();

  if (!session?.user) {
    return new Response(null, { status: 401 });
  }

  const courses = await prisma.courseTime.findMany({
    where: {
      course: {
        userId: session.user.id,
        deletedAt: null
      },
      dayOfWeek: dayjs(params.date).day()
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
              date: params.date
            },
            select: {
              status: true
            }
          }
        }
      }
    }
  });

  const attendances = await prisma.courseAttendance.groupBy({
    by: ["courseId", "status"],
    _count: {
      status: true
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
        const attended =
          attendances.find(
            (a) => a.status === "ATTENDED" && a.courseId === course.course.id
          )?._count.status || 0;
        const missed =
          attendances.find(
            (a) => a.status === "MISSED" && a.courseId === course.course.id
          )?._count.status || 0;
        const cancelled =
          attendances.find(
            (a) => a.status === "CANCELLED" && a.courseId === course.course.id
          )?._count.status || 0;

        const attendance = calculatePercentage(
          attended,
          missed,
          cancelled,
          session.user?.countCancelledCourses,
          session.user?.attendanceAsPercentage
        );

        return {
          ...course,
          status: course.course.courseAttendances[0]?.status || "",
          attendance,
          attended,
          missed,
          cancelled
        };
      })
    )
  );
}
