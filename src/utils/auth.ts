import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import prisma from "./db";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    attendanceAsPercentage: boolean;
    upcomingClassNotification: number;
    lowAttendanceNotification: number;
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
          upcomingClassNotification: user.upcomingClassNotification,
          lowAttendanceNotification: user.lowAttendanceNotification
        }
      };
    }
  }
});
