import { auth } from "@/utils/auth";
import prisma from "@/utils/db";
import { customAlphabet } from "nanoid";
import * as v from "valibot";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 12);

const schema = v.object({
  id: v.nullish(v.string()),
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(64)),
  abbreviation: v.nullish(v.pipe(v.string(), v.maxLength(12))),
  timezone: v.nullish(v.string()),
  times: v.pipe(
    v.array(
      v.object({
        day: v.pipe(v.number(), v.minValue(0), v.maxValue(6)),
        startTime: v.nullish(v.string()),
        endTime: v.nullish(v.string()),
        room: v.nullish(v.pipe(v.string(), v.maxLength(64)))
      })
    ),
    v.minLength(1)
  )
});

type ParsedData = v.InferInput<typeof schema>;

export async function POST(req: Request): Promise<Response> {
  const data = await req.json();
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(null, { status: 401 });
  }

  try {
    const parsedData: ParsedData = v.parse(schema, data);

    const courseTimesData = parsedData.times.map((time) => ({
      id: nanoid(),
      dayOfWeek: Number(time.day),
      timezone: parsedData.timezone,
      startTime: time.startTime,
      endTime: time.endTime,
      room: time.room
    }));

    await prisma.course.create({
      data: {
        id: nanoid(),
        name: parsedData.name,
        abbreviation: parsedData.abbreviation,
        userId: session.user.id,
        courseTimes: {
          createMany: {
            data: courseTimesData
          }
        }
      }
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof v.ValiError) {
      console.error(error);

      return new Response(null, { status: 422 });
    }

    throw error;
  }
}

export async function PATCH(req: Request): Promise<Response> {
  const data = await req.json();
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(null, { status: 401 });
  }

  try {
    const parsedData: ParsedData = v.parse(schema, data);

    if (!parsedData.id) {
      return new Response(null, { status: 422 });
    }

    const courseTimesData = parsedData.times.map((time) => ({
      id: nanoid(),
      dayOfWeek: Number(time.day),
      startTime: time.startTime,
      endTime: time.endTime,
      room: time.room
    }));

    await prisma.course.update({
      where: {
        id: parsedData.id,
        userId: session.user.id
      },
      data: {
        name: parsedData.name,
        abbreviation: parsedData.abbreviation
      }
    });

    if (courseTimesData.length > 0) {
      await prisma.courseTime.deleteMany({
        where: {
          courseId: parsedData.id
        }
      });

      await prisma.courseTime.createMany({
        data: courseTimesData.map((courseTime) => ({
          ...courseTime,
          courseId: parsedData.id as string,
          timezone: parsedData.timezone
        }))
      });
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof v.ValiError) {
      console.error(error);

      return new Response(null, { status: 422 });
    }

    throw error;
  }
}

export async function DELETE(req: Request): Promise<Response> {
  const { id } = await req.json();
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(null, { status: 401 });
  }

  if (!id) {
    return new Response(null, { status: 422 });
  }

  await prisma.course.update({
    where: {
      id,
      userId: session.user.id
    },
    data: {
      deletedAt: new Date()
    }
  });

  return new Response("OK");
}
