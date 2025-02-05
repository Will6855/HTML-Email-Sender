-- AlterTable
ALTER TABLE "GeneralAccount" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "GeneralAccount" ADD COLUMN "resetTokenExpiry" DATETIME;
