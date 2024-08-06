/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `CourseTime` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "abbreviation" TEXT;

-- AlterTable
ALTER TABLE "CourseTime" DROP COLUMN "deletedAt";
