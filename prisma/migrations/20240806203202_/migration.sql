/*
  Warnings:

  - The `countCancelledCourses` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CountCancelled" AS ENUM ('NONE', 'ATTENDED', 'MISSED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "countCancelledCourses",
ADD COLUMN     "countCancelledCourses" "CountCancelled";
