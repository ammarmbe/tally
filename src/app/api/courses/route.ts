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
  "0": v.nullish(
    v.object({
      startTime: v.nullish(v.string()),
      endTime: v.nullish(v.string()),
      room: v.nullish(v.pipe(v.string(), v.maxLength(64)))
    })
  ),
  "1": v.nullish(
    v.object({
      startTime: v.nullish(v.string()),
      endTime: v.nullish(v.string()),
      room: v.nullish(v.pipe(v.string(), v.maxLength(64)))
    })
  ),
  "2": v.nullish(
    v.object({
      startTime: v.nullish(v.string()),
      endTime: v.nullish(v.string()),
      room: v.nullish(v.pipe(v.string(), v.maxLength(64)))
    })
  ),
  "3": v.nullish(
    v.object({
      startTime: v.nullish(v.string()),
      endTime: v.nullish(v.string()),
      room: v.nullish(v.pipe(v.string(), v.maxLength(64)))
    })
  ),
  "4": v.nullish(
    v.object({
      startTime: v.nullish(v.string()),
      endTime: v.nullish(v.string()),
      room: v.nullish(v.pipe(v.string(), v.maxLength(64)))
    })
  ),
  "5": v.nullish(
    v.object({
      startTime: v.nullish(v.string()),
      endTime: v.nullish(v.string()),
      room: v.nullish(v.pipe(v.string(), v.maxLength(64)))
    })
  ),
  "6": v.nullish(
    v.object({
      startTime: v.nullish(v.string()),
      endTime: v.nullish(v.string()),
      room: v.nullish(v.pipe(v.string(), v.maxLength(64)))
    })
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

    if (
      Object.keys(parsedData).filter(
        (key) => !Number.isNaN(Number.parseInt(key))
      ).length === 0
    ) {
      return new Response(null, { status: 422 });
    }

    const courseTimesData = Object.keys(parsedData)
      .filter((key) => !Number.isNaN(Number.parseInt(key)))
      .map((key) => ({
        id: nanoid(),
        dayOfWeek: Number.parseInt(key),
        startTime:
          parsedData[key as "0" | "1" | "2" | "3" | "4" | "5" | "6"]?.startTime,
        endTime:
          parsedData[key as "0" | "1" | "2" | "3" | "4" | "5" | "6"]?.endTime,
        room: parsedData[key as "0" | "1" | "2" | "3" | "4" | "5" | "6"]?.room
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

    const courseTimesData = Object.keys(parsedData)
      .filter((key) => !Number.isNaN(Number.parseInt(key)))
      .map((key) => ({
        id: nanoid(),
        dayOfWeek: Number.parseInt(key),
        startTime:
          parsedData[key as "0" | "1" | "2" | "3" | "4" | "5" | "6"]?.startTime,
        endTime:
          parsedData[key as "0" | "1" | "2" | "3" | "4" | "5" | "6"]?.endTime,
        room: parsedData[key as "0" | "1" | "2" | "3" | "4" | "5" | "6"]?.room
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
          courseId: parsedData.id as string
        }))
      });
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof v.ValiError) {
      return new Response(null, { status: 422 });
    }

    throw error;
  }
}
