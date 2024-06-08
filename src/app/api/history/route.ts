import sql from "@/lib/db";
import { getUser } from "@/lib/getUser";
import dayjs from "dayjs";

export async function GET(req: Request) {
  const { user } = await getUser();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  let cursor = searchParams.get("cursor");

  if (cursor === "0") {
    const res = await sql(
      "SELECT GREATEST(date + interval '1 days', (CURRENT_DATE at time zone 'Africa/Cairo')::date + interval '1 days') AS date FROM entries JOIN courses ON courses.id = entries.course_id JOIN course_times ON course_times.course_id = courses.id AND LOWER(to_char(entries.date, 'Day')) = course_times.day WHERE user_id = $1 ORDER BY entries.date DESC, course_times.start DESC LIMIT 1",
      [user.id],
    );

    if (res.length) {
      const { date } = res[0];

      cursor = dayjs(`${dayjs(date).format("YYYY-MM-DD")} 23:59:59`)
        .valueOf()
        .toString();
    }
  }

  // convert cursor to date and start
  const date = new Date(Number(cursor));

  const [count] = await sql("SELECT COUNT(*) FROM courses WHERE user_id = $1", [
    user.id,
  ]);

  if (Number(count.count) > 0) {
    const data = await sql(
      "WITH date_series AS (SELECT generate_series($2::date - interval '11 days', $2::date - interval '1 days', '1 day'::interval)::date AS date) SELECT courses.id AS course_id, entries.id AS entry_id, courses.name AS course_name, course_times.start, course_times.end, course_times.room, date_series.date AS date, entries.type AS status, (SELECT COUNT(*) FROM entries WHERE course_id = courses.id AND type = 'attended') AS attended, (SELECT COUNT(*) FROM entries WHERE course_id = courses.id AND type = 'missed') AS missed FROM date_series JOIN course_times ON course_times.day = TRIM(LOWER(to_char(date_series.date, 'Day'))) LEFT JOIN entries ON course_times.course_id = entries.course_id AND date_series.date = entries.date LEFT JOIN courses ON courses.id = course_times.course_id WHERE courses.user_id = $1 ORDER BY date_series.date DESC, course_times.start ASC",
      [user.id, date],
    );

    return new Response(JSON.stringify(data));
  }

  return new Response(JSON.stringify([]));
}
