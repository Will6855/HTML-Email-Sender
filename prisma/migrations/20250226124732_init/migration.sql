-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'DEMO');

-- CreateTable
CREATE TABLE "GeneralAccount" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'DEMO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "GeneralAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "smtpServer" TEXT NOT NULL,
    "smtpPort" INTEGER NOT NULL DEFAULT 587,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "generalAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "subject" TEXT,
    "senderName" TEXT,
    "generalAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailAccountId" TEXT,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneralAccount_username_key" ON "GeneralAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralAccount_email_key" ON "GeneralAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailAccount_email_key" ON "EmailAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_name_generalAccountId_key" ON "EmailTemplate"("name", "generalAccountId");

-- AddForeignKey
ALTER TABLE "EmailAccount" ADD CONSTRAINT "EmailAccount_generalAccountId_fkey" FOREIGN KEY ("generalAccountId") REFERENCES "GeneralAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailTemplate" ADD CONSTRAINT "EmailTemplate_generalAccountId_fkey" FOREIGN KEY ("generalAccountId") REFERENCES "GeneralAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailTemplate" ADD CONSTRAINT "EmailTemplate_emailAccountId_fkey" FOREIGN KEY ("emailAccountId") REFERENCES "EmailAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
