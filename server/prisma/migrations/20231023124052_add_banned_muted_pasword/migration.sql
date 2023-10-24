-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "password" TEXT;

-- CreateTable
CREATE TABLE "_chatroomAdmin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_chatroomBannedUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_chatroomMutedUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_chatroomAdmin_AB_unique" ON "_chatroomAdmin"("A", "B");

-- CreateIndex
CREATE INDEX "_chatroomAdmin_B_index" ON "_chatroomAdmin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_chatroomBannedUsers_AB_unique" ON "_chatroomBannedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_chatroomBannedUsers_B_index" ON "_chatroomBannedUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_chatroomMutedUsers_AB_unique" ON "_chatroomMutedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_chatroomMutedUsers_B_index" ON "_chatroomMutedUsers"("B");

-- AddForeignKey
ALTER TABLE "_chatroomAdmin" ADD CONSTRAINT "_chatroomAdmin_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatroomAdmin" ADD CONSTRAINT "_chatroomAdmin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatroomBannedUsers" ADD CONSTRAINT "_chatroomBannedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatroomBannedUsers" ADD CONSTRAINT "_chatroomBannedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatroomMutedUsers" ADD CONSTRAINT "_chatroomMutedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatroomMutedUsers" ADD CONSTRAINT "_chatroomMutedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
