-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "accepted" BOOLEAN,
ADD COLUMN     "pending" BOOLEAN DEFAULT true;
