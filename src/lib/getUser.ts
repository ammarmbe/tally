import { nanoid } from "nanoid";
import { lucia } from "./auth";
import { cookies } from "next/headers";
import { cache } from "react";
import sql from "./db";

const getGoogleUser = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId)
    return {
      user: null,
      session: null,
    };

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
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }

  return { user, session };
});

export const getUser = async () => {
  const user = await getGoogleUser();

  if (!user.user) {
    const localUser = cookies().get("local_user")?.value;

    if (localUser) {
      return {
        user: {
          id: localUser,
          imageUrl: "https://singlecolorimage.com/get/d4d4d4/100x100",
        },
        session: null,
      };
    }

    const id = nanoid(32);

    await sql("INSERT INTO users (id) VALUES ($1)", [id]);

    cookies().set("local_user", id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return {
      user: {
        id,
        imageUrl: "https://singlecolorimage.com/get/d4d4d4/100x100",
      },
      session: null,
    };
  }

  return user;
};
