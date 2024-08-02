/*
  Warnings:

  - A unique constraint covering the columns `[courseId,date]` on the table `CourseAttendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CourseAttendance_courseId_date_key" ON "CourseAttendance"("courseId", "date");
