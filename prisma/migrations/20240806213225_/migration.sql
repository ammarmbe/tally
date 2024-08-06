/*
  Warnings:

  - You are about to drop the column `status` on the `CourseAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `countCancelledCourses` on the `User` table. All the data in the column will be lost.
  - Added the required column `attended` to the `CourseAttendance` table without a default value. This is not possible if the table is not empty.
  - Made the column `attendanceAsPercentage` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CourseAttendance" DROP COLUMN "status",
ADD COLUMN     "attended" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "countCancelledCourses",
ADD COLUMN     "lowAttendanceNotification" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upcomingClassNotification" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "attendanceAsPercentage" SET NOT NULL,
ALTER COLUMN "attendanceAsPercentage" SET DEFAULT false;

-- DropEnum
DROP TYPE "CountCancelled";

-- DropEnum
DROP TYPE "Status";
