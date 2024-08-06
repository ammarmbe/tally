import { auth } from "@/utils/auth";
import prisma from "@/utils/db";
import { calculatePercentage } from "@/utils/shared";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new Response(null, { status: 401 });
  }

  const courses = await prisma.course.findMany({
    where: {
      userId: session.user.id,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      abbreviation: true,
      courseTimes: {
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          room: true,
          endTime: true
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
        in: courses.map((c) => c.id)
      }
    }
  });

  return new Response(
    JSON.stringify(
      courses.map((course) => {
        const attended =
          attendances.find(
            (a) => a.status === "ATTENDED" && a.courseId === course.id
          )?._count.status || 0;
        const missed =
          attendances.find(
            (a) => a.status === "MISSED" && a.courseId === course.id
          )?._count.status || 0;
        const cancelled =
          attendances.find(
            (a) => a.status === "CANCELLED" && a.courseId === course.id
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
          attendance,
          attended,
          missed,
          cancelled
        };
      })
    )
  );
}
