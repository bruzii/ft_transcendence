-- AlterTable
ALTER TABLE "User" ADD COLUMN     "inGame" BOOLEAN DEFAULT false,
ADD COLUMN     "lose" INTEGER DEFAULT 0,
ADD COLUMN     "win" INTEGER DEFAULT 0;
