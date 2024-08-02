import { auth } from "@/utils/auth";

export async function GET() {
  const session = await auth();

  return new Response(JSON.stringify(session?.user));
}
