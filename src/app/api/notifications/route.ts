import sql from "@/lib/db";
import sendPushNotification from "@/lib/sendNotifications";

export async function GET() {
  const data = (await sql(
    "WITH today_courses AS (SELECT c.id AS course_id, c.name AS course_name, ct.start, ct.room, c.user_id, u.durations, u.subscription FROM course_times ct JOIN courses c ON ct.course_id = c.id JOIN users u ON c.user_id = u.id WHERE ct.day = TRIM(LOWER(to_char(current_date, 'Day')))::text AND u.notifications = TRUE), notification_due AS (SELECT tc.course_id, tc.course_name, tc.start, tc.room, tc.user_id, tc.subscription, d.duration FROM today_courses tc, LATERAL unnest(tc.durations) AS d(duration) WHERE (tc.start::time - (current_time AT TIME ZONE 'Africa/Cairo')::time) <= interval '1 minute' * d.duration AND (tc.start::time - (current_time AT TIME ZONE 'Africa/Cairo')::time) >= interval '0 minute'), unnotified_courses AS (SELECT nd.course_id, nd.course_name, nd.start, nd.room, nd.user_id, nd.subscription, nd.duration FROM notification_due nd LEFT JOIN notifications n ON nd.course_id = n.course_id AND nd.duration = n.duration AND n.created_at::date = current_date WHERE n.id IS NULL) SELECT uc.course_id, uc.course_name, uc.start, uc.room, uc.subscription, uc.user_id, uc.duration FROM unnotified_courses uc",
  )) as {
    course_name: string;
    course_id: string;
    start: string;
    room: string;
    subscription: string;
    user_id: string;
    duration: number;
  }[];

  let courses: string[] = [];

  for await (const course of data) {
    !courses.includes(course.course_id) && (await sendPushNotification(course));

    await sql(
      "INSERT INTO notifications (course_id, duration) VALUES ($1, $2)",
      [course.course_id, course.duration],
    );

    courses.push(course.course_id);
  }

  return new Response(JSON.stringify(data.length));
}
