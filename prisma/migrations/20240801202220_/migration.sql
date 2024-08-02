/*
  Warnings:

  - You are about to drop the column `userId` on the `CourseAttendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseAttendance" DROP CONSTRAINT "CourseAttendance_userId_fkey";

-- AlterTable
ALTER TABLE "CourseAttendance" DROP COLUMN "userId",
ALTER COLUMN "startTime" SET DATA TYPE TIME,
ALTER COLUMN "endTime" SET DATA TYPE TIME;

-- AlterTable
ALTER TABLE "CourseTime" ALTER COLUMN "startTime" SET DATA TYPE TIME,
ALTER COLUMN "endTime" SET DATA TYPE TIME;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "attendanceAsPercentage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sendNotifications" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "NotificationSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSubscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NotificationSubscription" ADD CONSTRAINT "NotificationSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
