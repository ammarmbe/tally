import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import prisma from "./db";
import { $Enums } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    attendanceAsPercentage: boolean;
    countCancelledCourses: $Enums.CountCancelled;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database"
  },
  providers: [Google],
  callbacks: {
    session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          attendanceAsPercentage: user.attendanceAsPercentage,
          countCancelledCourses: user.countCancelledCourses
        }
      };
    }
  }
});
