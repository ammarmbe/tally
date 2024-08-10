/*
  Warnings:

  - You are about to drop the column `notificationEndpoint` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "notificationEndpoint",
ADD COLUMN     "notificationSubscription" TEXT;
