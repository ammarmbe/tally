import { auth } from "@/utils/auth";
import prisma from "@/utils/db";
import { sendClassUpcomingNotification } from "@/utils/shared";
import * as v from "valibot";

const schema = v.object({
  duration: v.picklist(["0", "15", "30", "45", "60", "120"]),
  subscription: v.nullish(v.string())
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response(null, { status: 401 });
  }

  const { duration, subscription } = await req.json();

  try {
    v.parse(schema, { duration, subscription });
  } catch (error) {
    return new Response(null, { status: 400 });
  }

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      upcomingClassNotification: Number.parseInt(duration),
      notificationSubscription: subscription
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
      users."notificationSubscription",
      courses.name,
      courseTimes."startTime",
      courseTimes.room
    FROM "User" users
      JOIN "Course" courses ON courses."userId" = users.id
      JOIN "CourseTime" courseTimes ON courseTimes."courseId" = courses.id
    WHERE users."upcomingClassNotification" != 0
      AND (courseTimes."lastNotified"::date IS NULL OR courseTimes."lastNotified"::date != CURRENT_DATE)
      AND EXTRACT(DOW FROM CURRENT_DATE AT TIME ZONE courseTimes.timezone) = courseTimes."dayOfWeek"
      AND CAST((CURRENT_TIME AT TIME ZONE courseTimes.timezone) AS TIME WITHOUT TIME ZONE)
        BETWEEN (courseTimes."startTime"::time - (users."upcomingClassNotification" * INTERVAL '1 minute'))
        AND (courseTimes."startTime"::time)
    `) as {
    notificationSubscription: string;
    id: string;
    name: string;
    startTime: string;
    room: string;
  }[];

  for (const course of data) {
    await sendClassUpcomingNotification({
      subscription: course.notificationSubscription,
      name: course.name,
      start: course.startTime,
      room: course.room
    });
  }

  await prisma.courseTime.updateMany({
    where: {
      id: {
        in: data.map((course) => course.id)
      }
    },
    data: {
      lastNotified: new Date()
    }
  });

  console.log(`Upcoming class notifications sent: ${data.length}`);

  return new Response("OK");
}
