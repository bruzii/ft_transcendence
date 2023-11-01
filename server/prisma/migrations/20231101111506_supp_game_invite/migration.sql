/*
  Warnings:

  - You are about to drop the column `status` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `GameInvitation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GameInvitation" DROP CONSTRAINT "GameInvitation_chatRoomId_fkey";

-- DropForeignKey
ALTER TABLE "GameInvitation" DROP CONSTRAINT "GameInvitation_id_fkey";

-- DropForeignKey
ALTER TABLE "GameInvitation" DROP CONSTRAINT "GameInvitation_invitationRecipientId_fkey";

-- DropForeignKey
ALTER TABLE "GameInvitation" DROP CONSTRAINT "GameInvitation_invitationSenderId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "status",
ADD COLUMN     "waiting" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "waitingForPlayer" BOOLEAN DEFAULT true;

-- DropTable
DROP TABLE "GameInvitation";
