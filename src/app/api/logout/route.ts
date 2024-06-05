import { lucia } from "@/lib/auth";
import { getUser } from "@/lib/getUser";
import { cookies } from "next/headers";

export async function GET() {
  const { session } = await getUser();

  if (!session) {
    return new Response("OK");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return new Response("OK");
}
