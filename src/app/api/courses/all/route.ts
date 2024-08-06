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
    by: ["courseId", "attended"],
    _count: {
      attended: true
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
        const total_attended =
          attendances.find(
            (a) => a.attended === true && a.courseId === course.id
          )?._count.attended || 0;

        const total_missed =
          attendances.find(
            (a) => a.attended === false && a.courseId === course.id
          )?._count.attended || 0;

        const attendance = calculatePercentage(
          total_attended,
          total_missed,
          session.user?.attendanceAsPercentage
        );

        return {
          ...course,
          attendance,
          total_attended,
          total_missed
        };
      })
    )
  );
}
