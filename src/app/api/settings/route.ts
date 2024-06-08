import sql from "@/lib/db";
import { getUser } from "@/lib/getUser";

export async function GET() {
  const { user } = await getUser();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const data = await sql(
    "SELECT notifications, durations FROM users WHERE id = $1",
    [user.id],
  );

  return new Response(JSON.stringify(data[0]));
}

export async function POST(req: Request) {
  const data: {
    notifications: boolean;
    durations: number[];
    subscription: PushSubscription | null;
  } = await req.json();

  const { user } = await getUser();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  if (!data.notifications) {
    await sql("UPDATE users SET notifications = FALSE WHERE id = $1", [
      user.id,
    ]);
  } else {
    await sql(
      "UPDATE users SET notifications = TRUE, durations = $1 WHERE id = $2",
      [data.durations, user.id],
    );
  }

  return new Response("OK");
}
