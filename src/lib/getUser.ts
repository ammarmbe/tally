import { lucia } from "./auth";
import { cookies } from "next/headers";
import { cache } from "react";
import { nanoid } from "nanoid";
import sql from "./db";

export const getUser = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    const usr = cookies().get("local_user")?.value;

    if (usr) {
      return {
        user: {
          id: usr,
          imageUrl: "https://singlecolorimage.com/get/d4d4d4/100x100",
        },
        session: null,
      };
    }

    const id = await createLocalUser();

    return {
      user: {
        id: id,
        imageUrl: "https://singlecolorimage.com/get/d4d4d4/100x100",
      },
      session: null,
    };
  }

  const { user, session } = await lucia.validateSession(sessionId);

  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      const usr = cookies().get("local_user")?.value;

      if (usr) {
        return {
          user: {
            id: usr,
            imageUrl: "https://singlecolorimage.com/get/d4d4d4/100x100",
          },
          session: null,
        };
      }

      const id = await createLocalUser();

      return {
        user: {
          id: id,
          imageUrl: "https://singlecolorimage.com/get/d4d4d4/100x100",
        },
        session: null,
      };
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }

  if (!user) {
    const usr = cookies().get("local_user")?.value;

    if (usr) {
      return {
        user: {
          id: usr,
          imageUrl: "https://singlecolorimage.com/get/d4d4d4/100x100",
        },
        session: null,
      };
    }

    const id = await createLocalUser();

    return {
      user: {
        id: id,
        imageUrl: "https://singlecolorimage.com/get/d4d4d4/100x100",
      },
      session: null,
    };
  }

  return { user, session };
});

async function createLocalUser() {
  const id = nanoid(32);

  await sql("INSERT INTO users (id) VALUES ($1)", [id]);

  cookies().set("local_user", id, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return id;
}
