import sql from "@/lib/db";
import { getUser } from "@/lib/getUser";

export async function GET() {
  const { user } = await getUser();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const data = await sql(
    "SELECT courses.id AS course_id, courses.name AS course_name, array_agg(json_build_array(course_times.day, course_times.start, course_times.end, course_times.room)) AS times, (SELECT COUNT(*) FROM entries WHERE course_id = courses.id AND type = 'attended') AS attended, (SELECT COUNT(*) FROM entries WHERE course_id = courses.id AND type = 'missed') AS missed, (SELECT COUNT(*) FROM entries WHERE course_id = courses.id AND type = 'cancelled') AS cancelled FROM courses LEFT JOIN course_times ON courses.id = course_times.course_id WHERE user_id = $1 GROUP BY courses.id",
    [user.id],
  );

  return new Response(JSON.stringify(data));
}

export async function POST(req: Request) {
  const data: {
    name: string;
    days: string[];
    times: {
      sunday: { start: string; end: string; room?: string };
      monday: { start: string; end: string; room?: string };
      tuesday: { start: string; end: string; room?: string };
      wednesday: { start: string; end: string; room?: string };
      thursday: { start: string; end: string; room?: string };
      friday: { start: string; end: string; room?: string };
      saturday: { start: string; end: string; room?: string };
    };
  } = await req.json();

  const { user } = await getUser();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const [id] = await sql(
    "INSERT INTO courses (name, days, user_id) VALUES ($1, $2, $3) RETURNING id",
    [data.name, data.days, user.id],
  );

  Object.entries(data.times).forEach(async ([day, { start, end, room }]) => {
    data.days.includes(day) &&
      (await sql(
        `INSERT INTO course_times (course_id, day, start, "end", room) VALUES ($1, $2, $3, $4, $5)`,
        [
          id?.id,
          day,
          start ? start : null,
          end ? end : null,
          room ? room : null,
        ],
      ));
  });

  return new Response("OK");
}

export async function PATCH(req: Request) {
  const data: {
    id: string;
    name: string;
    days: string[];
    times: {
      sunday: { start?: string; end?: string; room?: string };
      monday: { start?: string; end?: string; room?: string };
      tuesday: { start?: string; end?: string; room?: string };
      wednesday: { start?: string; end?: string; room?: string };
      thursday: { start?: string; end?: string; room?: string };
      friday: { start?: string; end?: string; room?: string };
      saturday: { start?: string; end?: string; room?: string };
    };
  } = await req.json();

  const { user } = await getUser();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  await sql(
    "UPDATE courses set name = $1, days = $2 WHERE id = $3 AND user_id = $4",
    [data.name, data.days, data.id, user.id],
  );

  await sql(
    "DELETE FROM course_times USING courses WHERE courses.id = course_times.course_id AND course_id = $1 AND user_id = $2",
    [data.id, user.id],
  );

  for await (const [day, { start, end, room }] of Object.entries(data.times)) {
    data.days.includes(day) &&
      (await sql(
        `INSERT INTO course_times (course_id, day, start, "end", room) VALUES ($1, $2, $3, $4, $5)`,
        [
          data.id,
          day,
          start ? start : null,
          end ? end : null,
          room ? room : null,
        ],
      ));
  }

  return new Response("OK");
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  const { user } = await getUser();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  await sql("DELETE FROM courses WHERE id = $1 AND user_id = $2", [
    id,
    user.id,
  ]);

  return new Response("OK");
}
