/*
  Warnings:

  - You are about to drop the `NotificationSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NotificationSubscription" DROP CONSTRAINT "NotificationSubscription_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notificationEndpoint" TEXT;

-- DropTable
DROP TABLE "NotificationSubscription";
