import sql from "@/lib/db";
import { getUser } from "@/lib/getUser";

export async function GET() {
  const { user } = await getUser();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const data = await sql(
    "SELECT duration FROM subscriptions WHERE user_id = $1",
    [user.id],
  );

  return new Response(JSON.stringify(data[0]?.duration ?? null));
}

export async function POST(req: Request) {
  const data: {
    notifications: boolean;
    duration: number;
    subscription: PushSubscription | null;
  } = await req.json();

  const { user } = await getUser();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  if (!data.notifications) {
    await sql("DELETE FROM subscriptions WHERE user_id = $1", [user.id]);
  } else {
    await sql(
      "INSERT INTO subscriptions (user_id, duration, subscription) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET duration = $2",
      [user.id, data.duration, data.subscription],
    );
  }

  return new Response("OK");
}
