import sql from "@/lib/db";
import { getUser } from "@/lib/getUser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const day = searchParams.get("day");

  const { user } = await getUser();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const [count] = await sql("SELECT COUNT(*) FROM courses WHERE user_id = $1", [
    user.id,
  ]);

  if (Number(count.count) > 0) {
    const data = await sql(
      "SELECT courses.id AS course_id, courses.name AS course_name, course_times.day, course_times.start, course_times.end, course_times.room, (SELECT COUNT(*) FROM entries WHERE course_id = courses.id AND type = 'attended') AS attended, (SELECT COUNT(*) FROM entries WHERE course_id = courses.id AND type = 'missed') AS missed, (SELECT type FROM entries WHERE course_id = courses.id AND date = (CURRENT_DATE at time zone 'Africa/Cairo')::date) AS status FROM courses LEFT JOIN course_times ON courses.id = course_times.course_id WHERE user_id = $1 AND course_times.day = $2 ORDER BY course_times.start ASC",
      [user.id, day],
    );

    return new Response(
      JSON.stringify({
        no_courses: false,
        courses: data,
      }),
    );
  }

  return new Response(
    JSON.stringify({
      no_courses: true,
      courses: [],
    }),
  );
}
