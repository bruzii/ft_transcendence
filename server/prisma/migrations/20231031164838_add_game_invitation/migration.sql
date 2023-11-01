-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "GameInvitation" (
    "id" SERIAL NOT NULL,
    "invitationSenderId" INTEGER NOT NULL,
    "invitationRecipientId" INTEGER NOT NULL,
    "chatRoomId" INTEGER NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "GameInvitation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameInvitation" ADD CONSTRAINT "GameInvitation_invitationSenderId_fkey" FOREIGN KEY ("invitationSenderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameInvitation" ADD CONSTRAINT "GameInvitation_invitationRecipientId_fkey" FOREIGN KEY ("invitationRecipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameInvitation" ADD CONSTRAINT "GameInvitation_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameInvitation" ADD CONSTRAINT "GameInvitation_id_fkey" FOREIGN KEY ("id") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
