import { auth } from "@/utils/auth";
import prisma from "@/utils/db";
import { sendLowAttendanceNotification } from "@/utils/shared";
import * as v from "valibot";

const schema = v.object({
  percentage: v.picklist(["0", "50", "55", "60", "65", "70", "75", "80"]),
  subscription: v.nullish(v.string())
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response(null, { status: 401 });
  }

  const { percentage, subscription } = await req.json();

  try {
    v.parse(schema, { percentage, subscription });
  } catch (error) {
    return new Response(null, { status: 400 });
  }

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      lowAttendanceNotification: Number.parseInt(percentage),
      notificationEndpoint: subscription
    }
  });

  return new Response("OK");
}

export async function GET(req: Request) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response(null, { status: 401 });
  }

  const data = (await prisma.$queryRaw`
    SELECT
      courseTimes.id,
      users."notificationEndpoint",
      courses.name,
      courseTimes."startTime",
      courseTimes.room
    FROM "User" users
      JOIN "Course" courses ON courses."userId" = users.id
      JOIN "CourseTime" courseTimes ON courseTimes."courseId" = courses.id
    WHERE users."lowAttendanceNotification" != 0
      AND (((((SELECT COUNT(*) FROM "CourseAttendance" WHERE "courseId" = courses.id AND attended = true)::FLOAT /
              (SELECT COUNT(*) + 1 FROM "CourseAttendance" WHERE "courseId" = courses.id)::FLOAT) * 100) <=
            users."lowAttendanceNotification") AND
          ((((SELECT COUNT(*) FROM "CourseAttendance" WHERE "courseId" = courses.id AND attended = true)::FLOAT /
              (SELECT COUNT(*) FROM "CourseAttendance" WHERE "courseId" = courses.id)::FLOAT) * 100) >
            users."lowAttendanceNotification"))
      AND EXTRACT(DOW FROM CURRENT_DATE AT TIME ZONE courseTimes.timezone) = courseTimes."dayOfWeek"
    `) as {
    notificationEndpoint: string;
    id: string;
    name: string;
    startTime: string;
    room: string;
  }[];

  for (const course of data) {
    await sendLowAttendanceNotification({
      endpoint: course.notificationEndpoint,
      name: course.name,
      start: course.startTime,
      room: course.room
    });
  }

  return new Response(JSON.stringify(data.length));
}
