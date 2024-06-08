import sql from "@/lib/db";
import { getUser } from "@/lib/getUser";
import { NextResponse, NextRequest } from "next/server";
import webpush, { PushSubscription } from "web-push";

webpush.setVapidDetails(
  "https://tally.ambe.dev",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string,
);

export async function POST(request: NextRequest) {
  const { user } = await getUser();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const { subscription } = (await request.json()) as {
    subscription: PushSubscription;
  };

  if (!subscription || !user.id) return;

  await sql("UPDATE users SET subscription = $1 WHERE id = $2", [
    JSON.stringify(subscription),
    user.id,
  ]);

  return NextResponse.json("OK");
}
