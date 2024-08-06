import { auth } from "@/utils/auth";
import prisma from "@/utils/db";

export async function PATCH(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response(null, { status: 401 });
  }

  const countCancelled: "NONE" | "ATTENDED" | "MISSED" = await req.json();

  if (!["NONE", "ATTENDED", "MISSED"].includes(countCancelled)) {
    return new Response(null, { status: 400 });
  }

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      countCancelledCourses: countCancelled
    }
  });

  return new Response("OK");
}
