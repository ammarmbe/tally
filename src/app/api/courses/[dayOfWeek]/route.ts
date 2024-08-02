import { auth } from "@/utils/auth";
import prisma from "@/utils/db";

export async function GET(
  _: Request,
  { params }: { params: { dayOfWeek: string } }
) {
  const session = await auth();

  if (!session?.user) {
    return new Response(null, { status: 401 });
  }

  const courseCount = await prisma.course.count({
    where: {
      userId: session.user.id
    }
  });

  if (courseCount === 0) {
    return new Response(null, { status: 404 });
  }

  const courses = await prisma.courseTime.findMany({
    where: {
      course: {
        userId: session.user.id
      },
      dayOfWeek: Number.parseInt(params.dayOfWeek)
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
          title: true,
          courseAttendances: {
            where: {
              date: new Date().toISOString()
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
    by: ["status"],
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
      courses.map((course) => ({
        ...course,
        status: course.course.courseAttendances[0]?.status || "",
        attended:
          attendances.find((a) => a.status === "ATTENDED")?._count.status || 0,
        missed:
          attendances.find((a) => a.status === "MISSED")?._count.status || 0,
        cancelled:
          attendances.find((a) => a.status === "CANCELLED")?._count.status || 0
      }))
    )
  );
}
