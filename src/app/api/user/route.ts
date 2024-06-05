import { getUser } from "@/lib/getUser";

export async function GET() {
  const user = await getUser();

  return new Response(JSON.stringify(user));
}
