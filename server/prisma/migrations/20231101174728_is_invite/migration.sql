/*
  Warnings:

  - Made the column `isInvite` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "isInvite" SET NOT NULL;
