import sql from "@/lib/db";
import sendPushNotification from "@/lib/sendNotifications";

export async function GET() {
  const data = (await sql(
    "SELECT DISTINCT courses.name AS course_name, courses.id, course_times.start, course_times.room, users.subscription, courses.user_id, course_times.day FROM course_times JOIN courses ON course_times.course_id = courses.id JOIN users ON users.id = courses.user_id LEFT JOIN notifications ON notifications.course_id = courses.id JOIN UNNEST(users.durations) AS duration ON course_times.start >= (NOW() AT TIME ZONE 'AFRICA/CAIRO' - (interval '1 minute' * duration))::TIME WHERE course_times.day = TRIM(LOWER(to_char(CURRENT_DATE, 'Day'))) AND users.notifications = TRUE AND (notifications.created_at < (NOW() AT TIME ZONE 'AFRICA/CAIRO' - INTERVAL '5 minutes') OR notifications.created_at > (NOW() AT TIME ZONE 'AFRICA/CAIRO' + INTERVAL '5 minutes') OR notifications.created_at IS NULL)",
  )) as {
    course_name: string;
    id: string;
    start: string;
    room: string;
    subscription: string;
    user_id: string;
  }[];

  for await (const course of data) {
    await sendPushNotification(course);
    await sql("INSERT INTO notifications (course_id) VALUES ($1)", [course.id]);
  }

  return new Response(JSON.stringify(data.length));
}
