import sql from "@/lib/db";
import { getUser } from "@/lib/getUser";

export async function POST(req: Request) {
  const { user } = await getUser();
  const { course_id, status, date } = await req.json();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  if (!status) {
    await sql(
      "DELETE FROM entries USING courses WHERE courses.id = course_times.course_id AND WHERE course_id = $1 AND date = coalesce($2, (CURRENT_DATE at time zone 'Africa/Cairo')::date) AND user_id = $3",
      [course_id, date, user.id],
    );
  } else {
    await sql(
      "INSERT INTO entries ((SELECT id FROM courses WHERE id = $1 AND user_id = $4), type, date) VALUES ($1, $2, coalesce($3, (CURRENT_DATE at time zone 'Africa/Cairo'))) ON CONFLICT (course_id, date) DO UPDATE SET type = $2",
      [course_id, status, date, user.id],
    );
  }

  return new Response("OK");
}
