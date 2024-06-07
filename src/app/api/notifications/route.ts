import sql from "@/lib/db";
import sendPushNotification from "@/lib/sendNotifications";

export async function GET() {
  const data = (await sql(
    "SELECT courses.name AS course_name, courses.id, course_times.start, course_times.room, subscriptions.subscription, courses.user_id FROM course_times JOIN courses ON course_times.course_id = courses.id JOIN subscriptions ON subscriptions.user_id = courses.user_id WHERE course_times.day = TRIM(LOWER(to_char(CURRENT_DATE, 'Day'))) AND course_times.start >= (NOW() at time zone 'Africa/Cairo' + interval '1 hour')::time",
  )) as {
    course_name: string;
    id: string;
    start: string;
    room: string;
    subscription: string;
    user_id: string;
  }[];

  console.log("Courses to be sent notification:", data.length);

  data.forEach(async (course) => {
    await sendPushNotification(course, course.user_id);
  });

  return new Response(JSON.stringify(data.length));
}
