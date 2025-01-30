-- CreateTable
CREATE TABLE "GeneralAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EmailAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "smtpServer" TEXT NOT NULL,
    "smtpPort" INTEGER NOT NULL DEFAULT 587,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "generalAccountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmailAccount_generalAccountId_fkey" FOREIGN KEY ("generalAccountId") REFERENCES "GeneralAccount" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "subject" TEXT,
    "senderName" TEXT,
    "generalAccountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "emailAccountId" TEXT,
    CONSTRAINT "EmailTemplate_generalAccountId_fkey" FOREIGN KEY ("generalAccountId") REFERENCES "GeneralAccount" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmailTemplate_emailAccountId_fkey" FOREIGN KEY ("emailAccountId") REFERENCES "EmailAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneralAccount_username_key" ON "GeneralAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralAccount_email_key" ON "GeneralAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailAccount_email_key" ON "EmailAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_name_generalAccountId_key" ON "EmailTemplate"("name", "generalAccountId");
