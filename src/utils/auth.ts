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
    attendanceAsPercentage?: boolean | null;
    upcomingClassNotification?: number | null;
    lowAttendanceNotification?: number | null;
  }
}

export const { handlers, signIn, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!
  })],
  session: {
    strategy: "database"
  },
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
