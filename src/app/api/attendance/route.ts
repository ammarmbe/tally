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
      "DELETE FROM entries WHERE course_id = $1 AND date = coalesce($2, (CURRENT_DATE at time zone 'Africa/Cairo')::date)",
      [course_id, date],
    );
  } else {
    await sql(
      "INSERT INTO entries (course_id, type, date) VALUES ($1, $2, coalesce($3, (CURRENT_DATE at time zone 'Africa/Cairo'))) ON CONFLICT (course_id, date) DO UPDATE SET type = $2",
      [course_id, status, date],
    );
  }

  return new Response("OK");
}
