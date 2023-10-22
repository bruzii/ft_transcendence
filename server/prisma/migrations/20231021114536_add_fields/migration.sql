-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "connected" BOOLEAN DEFAULT false,
ADD COLUMN     "xp" INTEGER DEFAULT 0;
